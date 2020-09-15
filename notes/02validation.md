# Validation with Formik and Yup

The Formik Component has a validate prop that is a Fn that takes the _values_ of the inputs and then runs a function through them and we can also access the **errors** as props inisde of Formik.

## validate

We create a validate prop where we pass a Fn:

```TSX
<Formik ...
  validate={values => {
    const errs: Record<string, string> = {};

    if (values.firstName.includes('bob')) errs.firstName = 'no bob';

    return errs;
  }}
...>
  {({ values, errors, isSubmitting }) => (
    ...
    <pre>{JSON.stringify(errors, null, 2)}</pre>
  )
```

Here we are validating and then printing the errors in a pre-tag so that we can see them as we get them. We then add the error prop to TextField and turn it into a boolean to trigger the red border on our input if we have an err:

```TSX
return (
  <TextField
    placeholder={placeholder}
    {...field}
    helperText={errorText}
    error={!!errorText}
  />
);
```

Now if we type "bob" in our firstName input, we get a message that says "no bob" and the input gets a red border. These come from the helperText and error props in TextField that get triggered by the Fn we passed to **validate** in our Formik Component.
