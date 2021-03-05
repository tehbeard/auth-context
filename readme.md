# @tehbeard/auth-context

OAuth reducer and actions for Redux.

## Plan

- make it composable.

```

const clientFactory = makeSecureAPI(fetchImpForOAuthCalls, fetchImplForAPI);

const actionFactory = clientFactory(client_id, client_secret, scopes)

const actions = actionFactory(store)

```