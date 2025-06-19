// src/pages/StepForm.jsx
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Steps, Button, Input, Typography } from 'antd';


const { Step } = Steps;
const { Title } = Typography;

// Validaciones con Yup
const validationSchema = Yup.object().shape({
  companyName: Yup.string().required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  businessType: Yup.string().required('Requerido'),
  primaryColor: Yup.string().required('Requerido'),
});

// Campos por paso
const stepFields = [
  [
    { name: 'companyName', label: 'Nombre de la empresa', component: <Input placeholder="Escribe el nombre de tu empresa" /> },
    { name: 'email',        label: 'Correo electrónico',  component: <Input placeholder="contacto@empresa.com" /> },
  ],
  [
    { name: 'businessType', label: 'Tipo de negocio',     component: <Input placeholder="Ej: Ecommerce, Blog, Servicios..." /> },
  ],
  [
    { name: 'primaryColor', label: 'Color principal',      component: <Input type="color" /> },
  ],
];

export default function StepForm() {
  const [current, setCurrent] = useState(0);

  const isLast = current === stepFields.length - 1;
  const isFirst = current === 0;

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  const handleSubmit = (values) => {
    console.log('Valores finales:', values);
    // aquí guardas y rediriges a /desktop
  };

  return (
    <div className="step-form-container">
      <Title level={2} style={{ color: '#333', marginBottom: 24 }}>Construye tu sitio en 3 pasos</Title>
      <Steps size="small" current={current} style={{ width: '100%', maxWidth: 600, marginBottom: 32 }}>
        {stepFields.map((_, idx) => <Step key={idx} />)}
      </Steps>

      <Formik
        initialValues={{
          companyName: '',
          email: '',
          businessType: '',
          primaryColor: '#1890ff',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, isValid, validateForm }) => (
          <Form style={{ width: '100%', maxWidth: 600 }}>
            {stepFields[current].map((field) => (
              <div key={field.name} style={{ marginBottom: 24 }}>
                <label htmlFor={field.name} style={{ display: 'block', marginBottom: 8 }}>
                  {field.label}
                </label>
                <Field name={field.name}>
                  {({ field: f }) =>
                    React.cloneElement(field.component, { ...f, id: field.name, style: { width: '100%' } })
                  }
                </Field>
                <ErrorMessage name={field.name} component="div" style={{ color: 'red', marginTop: 4 }} />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button disabled={isFirst} onClick={prev}>
                Anterior
              </Button>
              {!isLast && (
                <Button
                  type="primary"
                  onClick={() => {
                    validateForm().then((errs) => {
                      if (!errs || Object.keys(errs).length === 0) next();
                    });
                  }}
                >
                  Siguiente
                </Button>
              )}
              {isLast && (
                <Button type="primary" htmlType="submit" disabled={!isValid}>
                  Finalizar
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
