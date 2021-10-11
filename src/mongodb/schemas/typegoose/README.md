A note about Typescript's Optional operator:

```ts
@prop()
someProperty?: string;
@prop()
someOtherProperty: string;
```

This operator does not affect the _schema_, but the _constructor_.

```ts
TestModel.create({
  someProperty: 'hello'
});
         ^ No overload matches this call
         10:  someOtherProperty: string;
         'someOtherProperty' is defined here
```

TLDR:
Only make member properties non-optional when they are required for construction.
