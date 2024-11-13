---
"@neo4j/graphql": patch
---

Deprecate single element relationships:

```graphql
type Movie {
    director: Person @relationship(type: "DIRECTED", direction: "IN")
}
```

In favor of list relationships:

```graphql
type Movie {
    director: [Person!]! @relationship(type: "DIRECTED", direction: "IN")
}
```
