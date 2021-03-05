import { createSelector } from 'reselect';

export const createClaimSelector = (token:string, key:string, defaultValue:any = undefined) => state => state.oauth.tokens[token]?.claims[key] ?? defaultValue;

export const selectIsAccessTokenExpired = createSelector(createClaimSelector("accessToken","exp", -1), exp => exp < Math.floor(Date.now()/1000) )

export const selectUsername = createClaimSelector("idToken","name");
export const selectUserId = createClaimSelector("accessToken","sub");

export const selectIsAuthenticating = state => state.oauth.authenticating;

export const selectAccessToken = state => state.oauth.tokens.accessToken.token;