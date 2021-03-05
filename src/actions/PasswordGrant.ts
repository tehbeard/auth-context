import { IsAuthenticating } from "./IsAuthenticating";
import { SetTokens } from "./SetTokens";

export const createPasswordGrantAction = (fetch) => (client_id, client_secret, scope) => (
  username,
  password
) => async (dispatch) => {
  dispatch(IsAuthenticating(true));
  try {
    const payload = await fetch("/oauth/token", {
      body: {
        grant_type: "password",
        client_id,
        client_secret,
        scope,
        username,
        password,
      },
    });
    dispatch(
      SetTokens(payload.access_token, payload.refresh_token, payload.id_token)
    );
  } catch (e) {
    dispatch(IsAuthenticating(false));
    throw e;
  }
};
