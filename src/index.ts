import update from "immutability-helper";

import {
  ACTION_SET_TOKENS,
  ACTION_CLEAR_TOKENS,
  ACTION_START_AUTH,
  ACTION_SET_ERROR
} from "./actions";

export const STATE_UNAUTHED = "UNAUTHED";
export const STATE_AUTHING = "AUTHING";
export const STATE_AUTHED = "AUTHED";
export const STATE_ERROR = "ERROR";

export * from './actions'

const INITIAL_STATE = {
  state: STATE_UNAUTHED,
  error: null,
  tokens: {
    accessToken: null,
    refreshToken: null,
    idToken: null,
  },
};

export const getClaims = (c) => JSON.parse(atob(c.split(".")[1]));

const makeTokenState = (tokenKey, token) => (!!token) ? { [tokenKey]: {$set: { token, claims:getClaims(token) } } } : {}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_CLEAR_TOKENS:
      return INITIAL_STATE;
    case ACTION_START_AUTH:
      return update(state, { state: {$set: STATE_AUTHING}, error: { $set: null } });
    case ACTION_SET_TOKENS:
      return update(state, {
        state: { $set: STATE_AUTHED },
        tokens: {
          ...makeTokenState("accessToken", action.payload.accessToken),
          ...makeTokenState("refreshToken", action.payload.refreshToken),
          ...makeTokenState("idToken", action.payload.idToken),
        },
      });
    case ACTION_SET_ERROR:
      return update(state, {
        state: {$set: STATE_ERROR },
        error: {$set: action.payload }
      })
    default:
      return state;
  }
};