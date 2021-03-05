import { IsAuthenticating } from "./IsAuthenticating";
import { SetTokens } from "./SetTokens";

const qs = (params) => Object.keys(params)
  .map(
    (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
  )
  .join("&");

export const createAuthCodeGrantAction = fetch => (client_id, client_secret, scope) => () => async (
  dispatch
) => {
  dispatch(IsAuthenticating(true));
  try {
    const queryString = qs({
      response_type: "code",
      response_mode: "web_message",
      client_id,
      client_secret,
      scope,
      redirect_uri: location.origin,
    });

    const authCode = await new Promise((resolve, reject) => {
      const popup = window.open(`/oauth/authorize?${queryString}`, "OAuth");

      const popupClosedCb = () => {
        dispatch(IsAuthenticating(false));
        reject();
      };
      popup.addEventListener("close", popupClosedCb);

      const cb = (ev) => {
        if (ev.source == popup && ev.data.type == "authorization_response") {
          popup.removeEventListener("message", cb);
          window.removeEventListener("message", cb);

          popup.removeEventListener("close", popupClosedCb);
          popup.close();
          resolve(ev.data.response.code);
        }
      };
      window.addEventListener("message", cb);
      popup.addEventListener("message", cb);
    });

    const payload = await fetch("/oauth/token", {
      body: {
        grant_type: "authorization_code",
        client_id,
        client_secret,
        code: authCode,
      }
    });
    dispatch(
      SetTokens(payload.access_token, payload.refresh_token, payload.id_token)
    );
  } catch (e) {
    dispatch(IsAuthenticating(false));
    throw e;
  }
};
