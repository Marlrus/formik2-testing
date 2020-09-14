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
