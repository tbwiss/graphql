---
"@neo4j/graphql": patch
---

Add support for filtering GraphQL only events in CDC subscriptions with the option `onlyGraphQLEvents` passed to `Neo4jGraphQLSubscriptionsCDCEngine`

```ts
const engine = new Neo4jGraphQLSubscriptionsCDCEngine({
    driver,
    onlyGraphQLEvents: true,
});

const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    features: {
        subscriptions: engine,
    },
});
```
