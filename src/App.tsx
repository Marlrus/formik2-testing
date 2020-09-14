import React from 'react';
import { Formik, Field, Form, useField, FieldAttributes } from 'formik';
import {
  Button,
  TextField,
  Checkbox,
  Radio,
  FormControlLabel,
} from '@material-ui/core';

import './App.css';

type MyRadioProps = { label: string } & FieldAttributes<{}>;

const MyRadio: React.FC<MyRadioProps> = ({ label, ...props }) => {
  const [field] = useField(props);
  return <FormControlLabel {...field} control={<Radio />} label={label} />;
};

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

function App() {
  return (
    <div>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          isTall: false,
          cookies: [],
          yoghurt: '',
        }}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          // make async call
          console.log({ data });
          setSubmitting(false);
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <MyTextField
              placeholder='first name'
              name='firstName'
              type='input'
              as={TextField}
            />
            <div>
              <Field
                placeholder='last name'
                name='lastName'
                type='input'
                as={TextField}
              />
            </div>
            <div>
              <Field name='isTall' type='checkbox' as={Checkbox} />
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
            </div>
            <div> Yoghurt:</div>
            <MyRadio name='yoghurt' type='radio' value='peach' label='peach' />
            <MyRadio
              name='yoghurt'
              type='radio'
              value='blueberry'
              label='blueberry'
            />
            <MyRadio name='yoghurt' type='radio' value='apple' label='apple' />
            <div>
              <Button disabled={isSubmitting} type='submit'>
                Submit
              </Button>
            </div>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
