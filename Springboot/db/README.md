# db/ scripts

Run against the Atlas cluster with [mongosh](https://www.mongodb.com/docs/mongodb-shell/):

```bash
mongosh "$MONGODB_URI" springboot/db/init-indexes.js
mongosh "$MONGODB_URI" springboot/db/seed-admin.js
```

Both scripts are idempotent (safe to re-run). The Spring Boot backend also creates indexes via
annotated repositories and seeds the default admin automatically on every startup, so these
scripts are only needed for manual/ad-hoc database setup outside the app.

See [schema.md](schema.md) for the full collection/field/index reference.
