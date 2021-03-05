import { ACTION_START_AUTH } from "./actions";


export const IsAuthenticating = (isAuthenticating) => ({
  type: ACTION_START_AUTH,
  payload: { isAuthenticating },
});
