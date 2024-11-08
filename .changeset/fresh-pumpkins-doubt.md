---
"@neo4j/graphql": patch
---

Deprecate implicit _SET:

```graphql
mutation {
    updateMovies( update: { id: "2" }) {
        movies {
            id
        }
    }
}
```
in favour of the explicit version:

```
mutation {
    updateMovies(update: { id_SET: "2" }) {
        movies {
            id
        }
    }
}
```
