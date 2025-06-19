// src/Pages/BriefWizard.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Upload,
  Checkbox,
  Button,
  Progress,
  message,
  Select,
  Alert,
  Layout

} from 'antd'
import PalettePicker from '../components/PalettePicker'
import { db } from '../config/firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Spin } from 'antd'
import slugify from 'slugify'
import logo from '../../src/assets/logo-white.png'
import logosBrands from '../../src/assets/logos-brands.png';
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useLocation } from 'react-router-dom'

import { ArrowLeftOutlined, InboxOutlined,UploadOutlined,  ArrowRightOutlined } from '@ant-design/icons'
import styles from './StepForm.module.css'

import dayjs from 'dayjs'

export default function BriefWizard() {
  const [selectedPalette, setSelectedPalette] = useState(null)
  const [current, setCurrent] = useState(0)
  const [form] = Form.useForm()
  const { Dragger } = Upload
  const { Option } = Select
  const [loading, setLoading] = useState(false);
const { Header, Content } = Layout
  const location = useLocation()
  // busco un param “phone” en la query: ?phone=5218311760335
  const params = new URLSearchParams(location.search)
  const urlPhone = params.get('phone') || ''
  const navigate = useNavigate()
  // Definimos unas paletas de ejemplo
const palettes = [
  // Startups tecnológicas
  ['#1A237E', '#3949AB', '#1DE9B6', '#ECEFF1'],
  ['#0D47A1', '#1976D2', '#FFC107', '#F5F5F5'],
  ['#263238', '#37474F', '#4DD0E1', '#CFD8DC'],
  ['#1B263B', '#415A77', '#778DA9', '#E0E1DD'],

  // Salud y bienestar
  ['#43A047', '#66BB6A', '#FFEB3B', '#FFFFFF'],
  ['#2E7D32', '#81C784', '#FFF59D', '#FAFAFA'],
  ['#AED581', '#C5E1A5', '#FFF8E1', '#F3F9F5'],
  ['#80CBC4', '#B2DFDB', '#E0F2F1', '#FAFAFA'],

  // Marcas de lujo
  ['#2B2E4A', '#E84545', '#903749', '#53354A'],
  ['#1C1C1C', '#B491C8', '#E0BBE4', '#F8F0FC'],
  ['#3E2723', '#5D4037', '#D7CCC8', '#FFFFFF'],
  ['#0D1B2A', '#1B263B', '#415A77', '#778DA9'],

  // Retail y e-commerce
  ['#37474F', '#62727B', '#FF7043', '#FFFFFF'],
  ['#263238', '#455A64', '#FFCA28', '#ECEFF1'],
  ['#FBE9E7', '#FFCDD2', '#E91E63', '#880E4F'],
  ['#FFF3E0', '#FFE0B2', '#FF9800', '#BF360C'],

  // Finanzas y banca
  ['#0B3D91', '#165BAC', '#F6A623', '#F0F4F8'],
  ['#283593', '#5C6BC0', '#FFEB3B', '#FFFFFF'],
  ['#1B262C', '#0F4C75', '#3282B8', '#BBE1FA'],
  ['#343A40', '#495057', '#ADB5BD', '#F8F9FA'],

  // Eco y sostenibilidad
  ['#00695C', '#00897B', '#A5D6A7', '#E8F5E9'],
  ['#2E7D32', '#388E3C', '#C5E1A5', '#F1F8E9'],
  ['#8BC34A', '#DCEDC8', '#FFFDE7', '#F9FBE7'],
  ['#4E342E', '#6D4C41', '#D7CCC8', '#EFEBE9'],

  // Alimentos y bebidas
  ['#BF360C', '#FF7043', '#FFD54F', '#FFF8E1'],
  ['#4E342E', '#795548', '#FFAB91', '#FBE9E7'],
  ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#B71C1C'],
  ['#FFF8E1', '#FFE0B2', '#FFCC80', '#FF6F00'],

  // Viajes y hospitalidad
  ['#0D47A1', '#1976D2', '#81D4FA', '#E1F5FE'],
  ['#00838F', '#4DD0E1', '#E1F5FE', '#FFFFFF'],
  ['#B3E5FC', '#81D4FA', '#29B6F6', '#01579B'],
  ['#FFF3E0', '#FFE0B2', '#FFCCBC', '#BF360C'],
];


  
  const normFile = e => {
  if (Array.isArray(e)) return e
  return e && e.fileList
}

  const steps = [
    {
  title: '¿En qué giro opera tu empresa?',
  fields: (
    <>
     

  
      <Form.Item
        name="businessSector"
        rules={[{ required: true, message: 'Selecciona el giro de tu negocio.' }]}
      >
      <Select
  mode="multiple"
  placeholder="Selecciona los que mejor te describan"
  size="large"
  allowClear
>
  <Option value="restaurantes">Restaurantes, cafeterías o bares</Option>
  <Option value="tiendaretail">Tienda física o retail</Option>
  <Option value="ecommerce">Tienda online / e-commerce</Option>
  <Option value="saludbienestar">Salud o bienestar</Option>
  <Option value="belleza">Belleza, estética o cuidado personal</Option>
  <Option value="serviciosprofesionales">Servicios profesionales</Option>
  <Option value="educacioncapacitacion">Educación o capacitación</Option>
  <Option value="artecultura">Arte, cultura o entretenimiento</Option>
  <Option value="hosteleria">Hostelería y turismo</Option>
  <Option value="salonpeluqueria">Salón de belleza o barbería</Option>
  <Option value="fitnessdeporte">Gimnasio, yoga o deportes</Option>
  <Option value="hogarjardin">Hogar y jardinería</Option>
  <Option value="mascotas">Mascotas y veterinaria</Option>
  <Option value="otros">Otro</Option>
</Select>

      </Form.Item>
      <p style={{ color: '#666', fontStyle: 'italic', fontSize: 14 }}>
        Ejemplo:{' '}
        "Belleza, estética o cuidado personal"
      </p>

     
    </>
  )
}

,
  {
  title: 'Sobre tu Empresa',
  fields: (
    <>
      {/* Empresa y fundación */}
      <p style={{ marginBottom: 8 }}>
      
        ¿Cuál es el nombre de negocio?
      </p>
      <Form.Item
        name="companyInfo"
        rules={[{ required: true, message: 'Por favor proporciona esos datos.' }]}
      >
        <Input
          rows={2}
          placeholder="Ej. TechCorp S.A. de C.V., fundada en 2015"
          size="large"
        />
      </Form.Item>
<p style={{ marginBottom: 8 }}>
      
    Platicame de tu negocio
      </p>
       <Form.Item
        name="businessStory"
        rules={[{ required: true, message: 'Por favor cuéntame sobre tu negocio.' }]}
      >

        <Input.TextArea
          rows={2}
          placeholder="Ej. Soy una pastelería artesanal que crea pasteles personalizados para todo tipo de celebración."
          size="large"
        />
      </Form.Item>

      <p style={{ color: '#666', fontStyle: 'italic', fontSize: 14 }}>
        Ejemplo:{' '}
        "Somos una pastelería artesanal que elaboramos pasteles personalizados para bodas y cumpleaños."
      </p>
  

    </>
  )
},
 
  {
    title: 'Logo y paleta de color',
    fields: (
      <>
        {/* Mensaje informativo muy visible */}
        <Alert
          message="Si no tienes logo, usaremos el nombre de tu negocio"
          type="info"
          showIcon
          style={{ marginBottom: 24, fontWeight: 'bold' }}
        />

        {/* Upload de logo (ahora opcional) */}
        <Form.Item
          name="logoFiles"
          label="Sube tu logo (opcional)"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          // ya no hay reglas de validación aquí
        >
          <Upload.Dragger
            name="logo"
            accept="image/png,image/svg+xml"
            beforeUpload={() => false}
            maxCount={1}
            multiple={false}
            style={{ padding: '1.5rem 0' }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 24, color: '#2e006b' }} />
            </p>
            <p style={{ margin: 0, color: '#555' }}>
              Arrastra o haz clic para subir tu logo (PNG / SVG)
            </p>
          </Upload.Dragger>
        </Form.Item>

        {/* Selector de paletas (igual que antes) */}
        <Form.Item
          label="Elige una paleta de color *"
          required
          validateStatus={selectedPalette == null ? 'error' : undefined}
          help={selectedPalette == null ? 'Selecciona una paleta para continuar' : null}
        >
          <PalettePicker
            palettes={palettes}
            value={selectedPalette}
            onChange={idx => {
              setSelectedPalette(idx)
              form.setFieldsValue({ palette: palettes[idx] })
            }}
          />
        </Form.Item>

        {/* Campo oculto para la paleta */}
        <Form.Item name="palette" hidden rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </>
    )
  }
,
    {
  title: 'Propuesta diferencial',
  fields: (
    <>
      <Form.Item
        name="differential"
        label={
          <>
           ¿Qué te diferencia de otros negocios y qué mensaje clave quieres transmitir?
          </>
        }
        rules={[{ required: true, message: 'Cuéntanos tu propuesta diferencial' }]}
      >
        <Input.TextArea
          rows={3}
          placeholder="Ej. Ofrecemos atención personalizada y envío exprés en 24 h"
          size="large"
        />
      </Form.Item>

      <div style={{ marginTop: 16, fontStyle: 'italic', color: '#555' }}>
        Ejemplo de respuesta: “Nos destaca nuestro servicio 100 % a la medida y precios competitivos para microempresas.”
      </div>
    </>
  )
}
,
  {
  title: 'Productos o Servicios clave (opcional)',
  fields: (
    <>
      <Form.List name="keyItems">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  marginBottom: 24,
                  border: '1px solid #eee',
                  padding: 16,
                  borderRadius: 8
                }}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'title']}
                  label="Título"
                >
                  <Input placeholder="Nombre del producto o servicio" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'image']}
                  label="Imagen"
                  valuePropName="fileList"
                  getValueFromEvent={e => e && e.fileList}
                >
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    + Subir
                  </Upload>
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                  label="Descripción"
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Describe brevemente este producto o servicio"
                  />
                </Form.Item>

                <Button
                  type="link"
                  danger
                  onClick={() => remove(name)}
                >
                  Eliminar
                </Button>
              </div>
            ))}

            {fields.length < 3 && (
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                >
                  + Agregar producto/servicio
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>

      <div
        style={{
          color: '#888',
          fontStyle: 'italic'
        }}
      >
        Hasta 3 elementos; puedes dejarlos en blanco si no aplican.
      </div>
    </>
  )
},
{
  title: 'Contacto',
  fields: (
    <>
      <Form.Item
        name="contactWhatsapp"
        label="Número de WhatsApp de contacto *"
        rules={[
          { required: true, message: 'El número de WhatsApp es obligatorio.' },
          { pattern: /^\+?\d{7,15}$/, message: 'Ingresa un número válido (7–15 dígitos).' }
        ]}
      >
        <Input placeholder="+52 1 234 567 8900" size="large" />
      </Form.Item>

      <Form.Item
        name="contactEmail"
        label="Correo electrónico principal *"
        rules={[
          { required: true, message: 'El correo es obligatorio.' },
          { type: 'email', message: 'Email inválido.' }
        ]}
      >
        <Input placeholder="hola@tuempresa.com" size="large" />
      </Form.Item>

      <Form.Item
        name="socialFacebook"
        label="Facebook (opcional)"
        rules={[{ type: 'url', message: 'URL inválida.' }]}
      >
        <Input placeholder="https://facebook.com/tuPagina" size="large" />
      </Form.Item>

      <Form.Item
        name="socialInstagram"
        label="Instagram (opcional)"
        rules={[{ type: 'url', message: 'URL inválida.' }]}
      >
        <Input placeholder="https://instagram.com/tuUsuario" size="large" />
      </Form.Item>
    </>
  )
},
    {
  title: 'Revisión final',
  fields: (
    <div style={{ lineHeight: 1.6 }}>
      <p><strong>Empresa y Fundación:</strong> {form.getFieldValue('companyInfo')}</p>
      <p><strong>Giro:</strong> {(form.getFieldValue('businessSector') || []).join(', ')}</p>
      <p><strong>Descripción breve:</strong> {form.getFieldValue('businessStory')}</p>
      <p><strong>Paleta seleccionada:</strong> {form.getFieldValue('palette')?.join(', ')}</p>
      <p><strong>Propuesta diferencial:</strong> {form.getFieldValue('differential')}</p>
      { (form.getFieldValue('keyItems') || []).map((item, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <strong>Producto {i+1}:</strong> {item.title}<br/>
          <em>Descripción:</em> {item.description}
        </div>
      )) }
      <p><strong>WhatsApp de contacto:</strong> {form.getFieldValue('contactWhatsapp')}</p>
      <p><strong>Fecha de revisión:</strong> {dayjs().format('YYYY-MM-DD')}</p>
    </div>
  )
}
  ]

  const next = async () => {
    try {
      // validar sólo los campos de este paso
      const map = [
  ['businessSector'],        // paso 1: validar sólo el select
  ['businessStory'],         // paso 2: validar sólo la descripción
  ['companyInfo'],           // paso 3: validar sólo companyInfo
  ['logoFiles','palette'],   // paso 4 original
  ['differential'],          // paso 5 original
  ['keyItems'],              // paso 6 original
  ['contactWhatsapp'],       // paso 7 original
  []                         // paso final no valida
]
      await form.validateFields(map[current] || [])
     if (current < steps.length - 1) {
       setCurrent(c => c + 1)
     } else {
       form.submit()
     }
    } catch {}
  }

  const prev = () => setCurrent(c => c - 1)

// … dentro de tu componente …

const onFinish = async (values) => {
  try {
    setLoading(true)

    // 1️⃣ Sube el logo
    const storage = getStorage()
    const logoFile = values.logoFiles?.[0]?.originFileObj
    let logoURL = ''
    if (logoFile) {
      const logoRef = ref(storage, `logos/${Date.now()}_${logoFile.name}`)
      await uploadBytes(logoRef, logoFile)
      logoURL = `https://firebasestorage.googleapis.com/v0/b/${
        storage.app.options.storageBucket
      }/o/${encodeURIComponent(logoRef.fullPath)}?alt=media`
    }

    // 2️⃣ Sube las imágenes de keyItems
    const itemsWithURLs = await Promise.all(
      (values.keyItems || []).map(async (item) => {
        let imageURL = ''
        const imgFile = item.image?.[0]?.originFileObj
        if (imgFile) {
          const imgRef = ref(storage, `keyItems/${Date.now()}_${imgFile.name}`)
          await uploadBytes(imgRef, imgFile)
          imageURL = `https://firebasestorage.googleapis.com/v0/b/${
            storage.app.options.storageBucket
          }/o/${encodeURIComponent(imgRef.fullPath)}?alt=media`
        }
        return {
          title:       item.title || '',
          description: item.description || '',
          imageURL
        }
      })
    )

    // 3️⃣ Genera el slug a partir del nombre de la empresa
    //    Ex: "TechCorp S.A. de C.V., fundada en 2015" → "techcorp-s-a-de-c-v"
    const rawName = values.companyInfo.split(',')[0]
    const slug = slugify(rawName, { lower: true, strict: true })

    // 4️⃣ Construye el objeto a guardar
    const negocio = {
      companyInfo:     values.companyInfo,
      businessSector:  values.businessSector,
      businessStory:   values.businessStory,
      palette:         values.palette,
      differential:    values.differential,
      keyItems:        itemsWithURLs,
      contactWhatsapp: values.contactWhatsapp,
      contactEmail:    values.contactEmail,
      socialFacebook:  values.socialFacebook || '',
      socialInstagram: values.socialInstagram || '',
      logoURL,
      slug,                            // ← aquí va el slug
      createdAt:       Timestamp.now(),
      status:          'Sin procesar'
    }

    // 5️⃣ Guarda en Firestore
    const docRef = await addDoc(collection(db, 'Negocios'), negocio)

    // 6️⃣ Mensaje de éxito y redirección
    message.success(`¡Brief guardado! Tu página estará disponible en /${slug}`)
    // Redirige a tu home u otra página:
    window.location.href = 'https://landing.negociosweb.mx/gracias/'
  } catch (err) {
    console.error('Error guardando en Firestore o Storage:', err)
    message.error('No se pudo guardar el brief')
  } finally {
    setLoading(false)
  }
}




  return (
 
    
    <div
   className={styles.briefWizardContainer}
   style={{ minHeight: '100vh' }}  /* solo lo que no puedas mover al CSS */
    >

        {loading && (
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          background: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}
      >
        <Spin tip="Please waiting..." size="large" />
      </div>
    )}

    <div style={{ /* tu contenedor normal */ }}>
    <div className={styles.navbar}>
  <img src={logo} alt="NegociosWeb.mx" className={styles.navbarLogo} />
  <div className={styles.navbarSpacer} />
 <Button
  type="ghost"                       // ← ghost para fondo transparente
  className={styles.navbarButton}
>
  Acceder
</Button>

</div>
    <section className={styles.heroSection}>

       
       <h1 className={styles.heroTitle}>
  Haz la página web de tu negocio en{' '}
  <span className={styles.highlight}>minutos y sin procesos difíciles</span>.
</h1>
       <h2 className={styles.heroSubTitle}>La recibes GRATIS, si te gusta la pagas. <span className={styles.highlight}>Llena el formulario 👇</span> </h2>
     </section>

      {/* … resto del wizard … */}
    </div>
      <div style={{
        maxWidth: 600,
        margin: '2rem auto',
        background: '#fff',
        borderRadius: 12,
        padding: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}>

       
      
       
<Progress
  percent={ current === 0
    ? 50
    : 50 + Math.round((current) / (steps.length - 1) * 50)
  }
  showInfo={false}
  strokeColor={{
    '0%': '#00E676',
    '100%': '#4DE38D',
  }}
/>
         <h2 className={styles.stepTitle}>
  {steps[current].title}
 </h2>
       <Form
  form={form}
  layout="vertical"
  onFinish={onFinish}
  initialValues={{
    companyInfo: '',
    businessSector: [],
    businessStory: '',
    logoFiles: [],
    palette: null,
    differential: '',
    keyItems: [],
    contactWhatsapp: '',
    hasCatalog: false,
    catalogType: '',
    catalogCount: ''
  }}
>
  {steps.map((step, idx) => (
    <div
      key={idx}
      style={{
        display: current === idx ? 'block' : 'none',
        // opcional: puedes añadir transición suave
        transition: 'opacity 0.3s',
        opacity: current === idx ? 1 : 0,
      }}
    >
      {step.fields}
    </div>
  ))}
    <Button
          icon={<ArrowLeftOutlined />}
          onClick={prev}
          disabled={current === 0}
          style={{ marginBottom: '1rem' }}
        />

</Form>



        <div className={styles.footerBar}>

  {current < steps.length - 1 ? (


      <Button
      type="ghost"                      // ← ghost en lugar de text/primary
      className={styles.continueButton} // misma clase que la navbarButton
      onClick={next}
      icon={<ArrowRightOutlined />}
    >
      Continuar
    </Button>
  ) : (
    <Button
      type="ghost"                      // ← ghost en lugar de text/primary
      className={styles.continueButton} // misma clase que la navbarButton
      onClick={next}
      icon={<ArrowRightOutlined />}
    >
      Hacer mi web
    </Button>
  )}
  
</div>





      </div>
  
{/* ↓ Nuevo bloque de logos ↓ */}
<section className={styles.brandsSection}>
  
  <h2 className={styles.heroSubTitle}> Más de  <span className={styles.highlight}>1,000</span> negocios ya confían en nosotros.</h2>
 

  <img
  
    src={logosBrands}
    alt="Empresas que usan NegociosWeb.mx"
    className={styles.brandsImage}
  />
   
 

</section>
    </div>
  )
}
