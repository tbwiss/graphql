---
"@neo4j/graphql": patch
---

CDC subscription optimization. Only node events with labels present in the GraphQL schema will be queried. This will reduce the number of subscription events queried by skipping events to nodes that cannot be subscribed through GraphQL
