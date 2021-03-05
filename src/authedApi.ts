import { ClearTokens, createAuthCodeGrantAction, createPasswordGrantAction, createRefreshTokenGrantAction } from "./actions";
import { selectAccessToken, selectIsAccessTokenExpired } from "./selectors";

import { composeFetch, withHeaders }  from "@tehbeard/compose-fetch";

export const createAuthedApi = (oAuthFetch, apiFetch) => (store, client_id, client_secret, scope) => {

    const refreshAction = createRefreshTokenGrantAction(oAuthFetch)(client_id, client_secret);
    const passwordAction = createPasswordGrantAction(oAuthFetch)(client_id, client_secret,scope)
    const codeGrant = createAuthCodeGrantAction(oAuthFetch)(client_id, client_secret, scope);

    const actionDispatch = action => (...args) => store.dispatch(action(...args))

    const callers = {
        RefreshToken: actionDispatch(refreshAction),
        LoginWithPassword: actionDispatch(passwordAction),
        LoginWithCode: actionDispatch(codeGrant),
        Logout: actionDispatch(ClearTokens),
        authedApiCall: composeFetch( fetch => async (url, init) => {
            if(selectIsAccessTokenExpired(store.getStore())){
                await callers.RefreshToken();
            }
            const headers = new Headers(init.headers ?? {});
            headers.set('authorization', `Bearer ${selectAccessToken(store.getStore())}`);
            const resp = await fetch(url, {
                ...init,
                headers
            });
            if(resp instanceof Response && !resp.ok && resp.status == 401 )
            {
                //Token was invalid
                callers.Logout();
            }
        },apiFetch)
    };

    return callers;
}