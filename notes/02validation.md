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

## Validating with Yup

We import \* as yup from yup and create a validationSchema outside of the component. Here we will call the **yup.object({})** method which will ease our validation:

```typescript
const validationSchema = yup.object({
  firstName: yup.string().required().max(10),
});
```

This will create our validation schema using an object that matches the keys of our form values. In this case we use yup to validate that firstName is a string, is required, and cannot be longer than 10 characters. To use it we add it to the **validationSchema prop** inside our Formik Component:

```TSX
validationSchema={validationSchema}
```

This will now validate and err if we don't meet the requirements of the validation. It will use custom messages which will be passed into the Formik **errors** prop that we are passing to TextField. We can pass custom messages on each validation method as a string is we wanted to.

## FieldArray and Select Input

We import a Formik Component called FieldArray which also uses the **render props pattern**:

```TSX
<FieldArray name='pets'>
  {({ })=> (

  )}
</FieldArray>
```

If we CTRL + Space we can see the props and methods we have access to here by default, geared towards handling Array types, which we will be using. We use the name **arrayHelpers** for the props passed into Field Array. We then proceed to create the **values** we need in our Formik component:

```TSX
pets: [{ type: 'cat', name: 'jarvis', id: '' + Math.random() }],
```

Which we have access to in our Formik render props. Inside FieldArray we return a div that maps over values.pets:

```TSX
<FieldArray name='pets'>
  {arrayHelpers => (
    <div>
      {values.pets.map((pet, index) => {
        return (
          ...
        );
      })}
    </div>
  )}
</FieldArray>
```

And inside we return a div that uses **MyTextField** for the _name prop_ in our pets values, and a **Field** component for our Select that uses the **MenuItem** and **Select** component from Material UI:

```TSX
{values.pets.map((pet, index) => {
  return (
    <div key={pet.id}>
      <MyTextField
        placeholder='pet name'
        name={`pets.${index}.name`}
      />
      <Field as={Select} name={`pets.${index}.type`}>
        <MenuItem value='cat'>cat</MenuItem>
        <MenuItem value='dog'>dog</MenuItem>
        <MenuItem value='frog'>frog</MenuItem>
      </Field>
    </div>
  );
})}
```

Here we map over the pets and use the pet.id which is a randomly generated number, as key. Then we do a string interpolation for the name, which I had never used before considering that the string would result in a name.number.name format. Apparently, Material UI automatically maps into MenuItem and we have a working Select that we can see in our state.

### Adding another Pet

We create a button that uses our **arrayHelpers** to create a new pet object when it is clicked:

```TSX
{arrayHelpers => (
  <div>
    <Button
      onClick={() =>
        arrayHelpers.push({
          type: 'frog',
          name: '',
          id: '' + Math.random(),
        })
      }
    >
      Add Pet
    </Button>
...
```

Here we use the **push** method to create a new item with no name, a default frog type, and an ID which we cast to a string using **'' +**. We now have a button that will create a new TextField and Select with everything that we want.

### Deleting a new Pet

We then create a button under the Select to remove the pet:

```TSX
<Button onClick={() => arrayHelpers.remove(index)}>
  X
</Button>
```

Which will use the **remove** method to remove the item using the index that we get from mapping our values. Now we can use the X to remove any pet that we want.

## Validation in Array Fields

We used yup to validate an object, we do a very similar pattern when validating an array field. We do:

```TSX
const validationSchema = yup.object({
  firstName: yup.string().required().max(10),
  pets: yup.array().of(
    yup.object({
      name: yup.string().required('Pet Name is Required.'),
    }),
  ),
});
```

Where we create validation for the **pets** array. We let Yup know that it is an array using **array** and then specify the validation using **of** where we pass a **yup.object** just as we used in the start of our validationSchema. If we leave the message as the default we can see that the message is mapped to the **name** field of our item which follows the `pets[0].name` pattern.
