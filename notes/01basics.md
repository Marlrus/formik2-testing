# Formik 2 Learning Ben Awad

Learning Formik 2 using CRA TypeScript Formik2, Yup, and Material UI.

## Intro

We start with npx CRA TS and then we install `yarn add formik yup @material-ui/core @material-ui/icons` to have the packages that we will need in order to execute this project.

## App TSX and Basic Components

We start by importing the Formik component from formik, and TextField from Material UI. We don't use the useFormik hook because we cannot use context when using the formik hooks. We then place the Formik component inside the main div. This component uses the **render props pattern** made popular by React Motion and React Router:

```JSX
function App() {
  return (
    <div>
      <Formik>
        {() => (
          <form>
            <TextField />
          </form>
        )}
      </Formik>
    </div>
  );
}
```

### Sidequest: Render Props

_Sidequest:_ I was reading into the render props pattern, in the React DOCS a **render prop** refers to a technique for sharing code between React ocmponents using a prop whose value is a function. This means that a component with a render props takes a Fn that returns a React element and calls it instead of implementing its own render logic. This is what we see in React Router in the _component_ prop, where we render a Component conditionally or based on a URL string.

Concretely, **a render prop is a fn prop that a component uses to know what to render**. You can implement _most HOC using a regular component with a render prop_. You **don't have to use a prop called render** to use this pattern, any Fn will do as long as it tells the Component what to render. The name of the prop is just a placeholder.

**The prop DOESN'T actually need to be named in the list of attributes in your JSX element**, you can actually put it inside the element, which is the patter we will be using in our Formik Component. This technique is unusual and it is what react-motion uses.

## Formik Component

We get an err beacuse the Formik Component needs 2 props: initialValues and onSubmit. Initial values contains the initial values your Form will hold, and onSubmit will handle the onSubmit method:

```JSX
<Formik initialValues={{firstName: 'bob'}} onSubmit={(data, {})=>{
  console.log(data);
}}>
```

the onSubmit method has 2 args, the first one is the data being submitted by the form, the second one is an object with plenty of options we can destructure. In my IDE I do not get this autocompletion, maybe it has changed recently.

Inside the Formik component in the render props props we can destructure and see all the props and methods that we have access to using the component. We will destructure 4:

```JSX
{({ values, handleChange, handleBlur, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <TextField
      name='firstName'
      value={values.firstName}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  </form>
)}
```

The values prop comes from initialValues and the values that change after that, handleChange will be our Fn to handle changes and we pass it to our MaterialUI Component. We will do the same with handleBlur. And we then pass handleSubmit to our form which will use the Fn that we defined on onSubmit in our Formik Component. This would be the same with any Component we would be using in our Component, even the base HTML tags.

We then run our project and can see that we have our Material UI TextInput with the value bob preset to it beacuse of the props that we passed to our Formik component. If we type something into the TextInput and hit enter, we trigger our onSumbit function and we can see that we get a log of the object with the prop firstName and the value that our TextInput has.

We add a pre-tag to show our value dynamically. With these arguments we show the JSON data prettier:

```JSX
<pre>{JSON.stringify(values, null, 2)}</pre>
```

We can also notice that onChange uses a standard handleChange() Fn that tracks the change of our inputs dynamically. We then add a Submit button using material UI to submit our form.

## Using onSubmit options

We use the setSubmitting option to disable the submit button upon submission. It takes a boolean as an argument, and then will reset:

```JSX
onSubmit={(data, { setSubmitting }) => {
  setSubmitting(true);
  // make async call
  console.log({ data });
  setSubmitting(false);
}}
```

We use it in our form by passing the **isSubmitting prop** and then using it on the disabled attribute of our button:

```JSX
({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
  ...
  <Button disabled={isSubmitting} type='submit'>
    Submit
  </Button>
  ...
)
```

There are also other methods such as **resetForm** that unfortunately I cannot get to autocomplete.

## Field Component & Form Component

If we create more inputs, we might have a lot of duplicate code as we need to pass the props to each different input. This is where we use the **Field** Component from Formik. We create a new input field for lastName and then replace the TextField component from material UI with the Field component:

```JSX
<Field name='firstName' type='input' as={TextField} />
<Field name='lastName' type='input' as={TextField} />
```

Here we set the name matching the keys in our initialValues and then set the type to input. We use the **as prop** to pass the component that will be rendered. Now we can see that the form is working as it was before but the code is much cleaner. This automatically maps the props to and how they are supposed to be. We can also **add placeholders if we want**. We can now remove handleChange and handleBlur in our destructured **render props**.

We import Form and replace our JS form component with it. This will automatically pass our onSubmit method to this component, meaning that we don't have to write the code out and we can now remove most of the **render props** that we destructured:

```JSX
{({ values, isSubmitting}) => (
  <Form>
    <Field
      placeholder='first name'
      name='firstName'
      type='input'
      as={TextField}
    />
  ...
```

### Adding more Fields

We create a Field that uses the Material UI Checkbox component, with a name isTall that is set in initialValues as false.

```JSX
<Field name='isTall' type='checkbox' as={Checkbox} />
```

We then create a new initialValue `cookies: []` which will be an array of the cookies we can eat. To create multiple checkboxes that will affect this value, we use the same name for all the fields which will automatically handle them as expected.

```JSX
<div>Cookies:</div>
<Field
  name='cookies'
  type='checkbox'
  value='chocolate chip'
  as={Checkbox}
/>
<Field
  name='cookies'
  type='checkbox'
  value='snickerdoodle'
  as={Checkbox}
/>
<Field
  name='cookies'
  type='checkbox'
  value='mint chip'
  as={Checkbox}
/>
```

Now we have 3 checkboxes and we can see that the values for the cookies get added to the Array when we check each checkbox. The important thing is to match the name, the initial value is not as important.

### Radio

We create a new value _yoghurt_ in our initialValues and then we create 3 Field Components with type radio and use Material UIs Radio Component. Since all the fields share the name, we can only pick one of the three, just as you expect on Radios in a form.

```JSX
<div> Yoghurt:</div>
<Field name='yoghurt' type='radio' value='peach' as={Radio} />
<Field name='yoghurt' type='radio' value='blueberry' as={Radio} />
<Field name='yoghurt' type='radio' value='apple' as={Radio} />
```

## Custom Radio

We see how Material UI works with Radio components and their labels. We then create a custom Fn that will use the component that we want and will work in a generic way. We call it **MyRadio**:

```JSX
const MyRadio = ({label, ...props}) => {
  const [field, meta] = useField(props)
  return <FormControlLabel {...field} control={<Radio />} label={label} />;
};
```

This component will take an object with a label, and other props that we will pass to the component. We use a Formik hook called useField that returns a **field** object that has a ton of values such as: **name, onBlur, onChange, value, checked, multiple**. The **meta** object that comes from the hook has: **error, initialError, initialTouched, initialValue, touched, value**. We can temporarily ignore this value.

### Typing our Component

We CTRL click useField and see the values that it takes. We see that it expects string | FieldAttributes. We create the type MyRadioProps and pass it to the React.FC. We use it and TS loves us again:

```JSX
type MyRadioProps = { label: string } & FieldAttributes<{}>

const MyRadio: React.FC<MyRadioProps> = ({label, ...props}) => {
  const [field] = useField(props)
  return <FormControlLabel {...field} control={<Radio />} label={label} />;
};
```

We pass an empty object, but if we check the typing it just does & T with that object, meaning that it uses the normal object and if we pass an empty one it is okay. We then use this component in our form:

```JSX
<MyRadio name='yoghurt' type='radio' value='peach' label='peach' />
<MyRadio
  name='yoghurt'
  type='radio'
  value='blueberry'
  label='blueberry'
/>
<MyRadio name='yoghurt' type='radio' value='apple' label='apple' />
```

This will add a label to our Radios and render them. This is probably the same pattern that the Field component uses, except that we slightly customized it.

## Custom MyTextField Err Handling

We might want to use this same pattern if we want to have Validation or show an error:

```JSX
const MyTextField: React.FC<FieldAttributes<{}>> = ({
  placeholder,
  ...props
}) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField placeholder={placeholder} {...field} helperText={errorText} />
  );
};
```

In this component we use both field, meta, we pass field as props, and meta for the errors we show. We use a ternary that creates an errorText value that will have the value **meta.error** of there is an error and the element has been touched. Otherwise the err will not display. We look into the documentation of TextField in Material UI and see that the text that we want to display is under the _helperText_ prop. Therefore we pass our errorText to that property in the Component.

We separate placeholder because useField will not use the placeholder prop and we will loose it, so we just pass it to TextField as its own prop.
