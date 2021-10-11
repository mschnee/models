# Data Mapper versus Active Record patterns

Because we maintain multiple database connections, we use the **data mapper** pattern.

```ts
const RwUser = rwConnection.getRepository(UserModel);
const RoUser = roConnection.getRepository(UserModel);
```
