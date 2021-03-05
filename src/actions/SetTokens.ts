import { ACTION_SET_TOKENS } from "./actions";


export const SetTokens = (
  access_token = null,
  refresh_token = null,
  id_token = null
) => {
  return {
    type: ACTION_SET_TOKENS,
    payload: {
      accessToken: access_token,
      refreshToken: refresh_token,
      idToken: id_token,
    },
  };
};
