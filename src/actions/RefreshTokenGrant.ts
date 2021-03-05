import { IsAuthenticating } from "./IsAuthenticating";
import { SetTokens } from "./SetTokens";


export const createRefreshTokenGrantAction = fetch => (client_id, client_secret) => async (
  dispatch,
  getState
) => {
  dispatch(IsAuthenticating(true));
  try {
    const payload = await fetch("/oauth/token", { body: {
      grant_type: "refresh_token",
      refresh_token: getState().oauth.tokens.refreshToken.token,
      client_id,
      client_secret,
    } });
    dispatch(
      SetTokens(payload.access_token, payload.refresh_token, payload.id_token)
    );
  } catch (e) {
    dispatch(IsAuthenticating(false));
    throw e;
  }
};
