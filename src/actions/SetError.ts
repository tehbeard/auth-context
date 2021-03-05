import { ACTION_SET_ERROR } from "./actions";


export const SetError = (error, error_description) => ({ type: ACTION_SET_ERROR, payload: { error, error_description } });
