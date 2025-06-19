// src/Pages/BriefWizard.jsx
import React, { useState, useEffect } from 'react'
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
import {


  query,
  where,
  getDocs,

} from 'firebase/firestore'

import { useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom'

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
// Genera un slug único (agrega -002, -003... si ya existe)
async function getUniqueSlug(rawName, db) {
  const baseSlug = slugify(rawName, { lower: true, strict: true });
  const refNeg = collection(db, 'Negocios');
  let slug = baseSlug;
  let counter = 2;

  // Busca todos los slugs iguales o con sufijo numérico
  let exists = true;
  while (exists) {
    const q = query(refNeg, where('slug', '==', slug));
    const snap = await getDocs(q);
    if (snap.empty) {
      exists = false;
    } else {
      slug = `${baseSlug}-${String(counter).padStart(3, '0')}`;
      counter++;
    }
  }
  return slug;
}



 
  const navigate = useNavigate()
  const { phone: urlPhone = '' } = useParams()
  const cleanedUrlPhone = urlPhone
  .replace(/\s+/g, '')      // quita espacios
  .replace(/^\+/, '')       // quita “+”
  .replace(/^521/, '')      // quita el “521” al inicio


// null = aún no he comprobado, '' = comprobado y NO existe, 'mensaje' = comprobado y SÍ existe
const [urlPhoneError, setUrlPhoneError] = useState(null)
const [phoneChecked,  setPhoneChecked]  = useState(false)



 useEffect(() => {
  console.log('Param phone:', urlPhone)
  console.log('Cleaned:', cleanedUrlPhone)
  if (!cleanedUrlPhone) {
    setUrlPhoneError(null)
    setPhoneChecked(true)
    return
  }

  // 🔥 Este bloque SÍ es necesario
  (async () => {
    try {
      const variants = [cleanedUrlPhone, '521' + cleanedUrlPhone]
      const refNeg = collection(db, 'Negocios')
      let exists = false

      for (let num of variants) {
        const snap = await getDocs(query(refNeg, where('leadPhone', '==', num)))
        if (!snap.empty) {
          exists = true
          break
        }
      }

      setUrlPhoneError(
        exists ? 'Ya existe un negocio con ese WhatsApp.' : ''
      )
      setPhoneChecked(true)
    } catch (e) {
      // Puedes mostrar un error amigable si falla Firestore
      setUrlPhoneError('Error validando teléfono')
      setPhoneChecked(true)
    }
  })()
}, [cleanedUrlPhone])







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

    ['#B71C1C', '#D32F2F', '#F44336', '#FFFFFF'],
  // Rojo con gris elegante (muy usado en fintech y tech)
  ['#C62828', '#BDBDBD', '#424242', '#F5F5F5'],
  // Rojo con azul corporativo
  ['#E53935', '#1E88E5', '#1565C0', '#F5F7FA'],
  // Rojo sobrio + dorado
  ['#A93226', '#E6B800', '#FBFCFC', '#212F3D'],
  // Rojo, negro y gris oscuro (consultorías y tech B2B)
  ['#B71C1C', '#212121', '#424242', '#ECECEC'],
  // Rojo vivo, azul marino y gris
  ['#FF1B1B', '#1A2238', '#9DAAF2', '#F4F4F4'],
  // Rojo oscuro y blanco puro (minimalista, para branding fuerte)
  ['#D72638', '#FFFFFF', '#2E2E2E', '#F7F7F7'],

  // Amarillo / Dorado y tierra
  ['#FFD23F', '#EEA243', '#1B1B1E', '#F5F1ED'],
  ['#FFC857', '#6A0572', '#AB83A1', '#F5F1ED'],
  ['#F9A620', '#F7F7FF', '#262626', '#A5BE00'],

  // Verdes y frescos
  ['#0B6E4F', '#3BB273', '#9BC53D', '#E0FF4F'],
  ['#86C232', '#61892F', '#222629', '#474B4F'],
  ['#1FAB89', '#62D2A2', '#9DF3C4', '#D7FBE8'],

  // Minimalistas/Grises
  ['#232931', '#393E46', '#EEEEEE', '#F6F6F6'],
  ['#22223B', '#4A4E69', '#9A8C98', '#F2E9E4'],
  ['#2E2E2E', '#FFD166', '#06D6A0', '#F6F6F6'],

  // Pasteles y creativas
  ['#FFB6B9', '#FAE3D9', '#BBDED6', '#8AC6D1'],
  ['#F9C6C9', '#FFB677', '#FFF2AF', '#D4EAC8'],
  ['#B2F9FC', '#FFD6E0', '#F6DFEB', '#C7CEEA'],

  // Elegantes
  ['#333533', '#6E8894', '#EAF6FF', '#FFFFFF'],
  ['#292F36', '#4ECDC4', '#FFE66D', '#FF6B6B'],
   // Azul corporativo clásico
  ['#003366', '#00509E', '#74A9CF', '#FFFFFF'],
  // Azul navy, gris claro, blanco (muy usado en SaaS)
  ['#223A5E', '#1E555C', '#E6E6EA', '#FFFFFF'],
  // Azul rey con acento aqua y blanco (startups y fintech)
  ['#1976D2', '#2196F3', '#00B8D9', '#F4F7FA'],
  // Azul, cian y acento verde (consultoría tecnológica)
  ['#264653', '#2A9D8F', '#E9C46A', '#F4F7FA'],
  // Azul oscuro y gris metálico (para despachos)
  ['#232F34', '#344955', '#4A6572', '#F9AA33'],
  // Azul petróleo, gris claro y blanco
  ['#2C3E50', '#6C7A89', '#BDC3C7', '#ECF0F1'],
  // Azul intenso, blanco y acento naranja (dinámico y moderno)
  ['#2541B2', '#1768AC', '#06BEE1', '#FFFFFF'],

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
<Form.Item
  label="Elige una paleta de color *"
  name="palette"
  rules={[{ required: true, message: 'Selecciona una paleta de color.' }]}
>
<PalettePicker
  palettes={palettes}
  value={form.getFieldValue('palette')}
  onChange={idx => {
    form.setFieldsValue({ palette: idx })
    form.validateFields(['palette'])
  }}
/>

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
  title: '',
  fields: (
    <>
      { urlPhone ? (
        // —— caso URL —— 
        !phoneChecked ? (
          // mientras validamos…
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Spin tip="Validando número…" />
          </div>
        ) : urlPhoneError ? (
          // válido, pero existe en Firestore
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: '#E53935', fontSize: '2rem' }}>💔 Lo sentimos</h2>
            <p>Ya hay un negocio registrado con el número de WhatsApp:</p>
            <p style={{ fontWeight: 600, fontSize: '1.5rem' }}>
              +521{cleanedUrlPhone}
            </p>
          </div>
        ) : (
          // válido y *no* existe
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: '#00E676', fontSize: '2rem' }}>✅ ¡Listo!</h2>
            <p>Te enviaremos el enlace de tu web al WhatsApp:</p>
            <p style={{ fontWeight: 600, fontSize: '1.5rem' }}>
              +521{cleanedUrlPhone}
            </p>
          </div>
        )
      ) : (
        // —— caso SIN URL (input manual) ——
        <Form.Item
  name="leadPhone"
  label="¿A qué número de WhatsApp enviamos el enlace?"
  rules={[
    { required: true, message: 'Necesitamos tu número de WhatsApp.' },
    {
      async validator(_, rawValue) {
        const val = rawValue
          .trim()
          .replace(/^\+/, '')
          .replace(/^521/, '')
        if (!/^\d{7,}$/.test(val)) {
          return Promise.reject(new Error('El número parece inválido.'))
        }
        // validación en Firestore con y sin 521
        const variants = [val, '521' + val]
        const refNeg   = collection(db, 'Negocios')
        for (let n of variants) {
          const snap = await getDocs(
            query(refNeg, where('leadPhone', '==', n))
          )
          if (!snap.empty) {
            return Promise.reject(
              new Error('Ya existe un negocio con ese WhatsApp.')
            )
          }
        }
        return Promise.resolve()
      }
    }
  ]}
>
  <Input placeholder="+521XXXXXXXXXX" size="large" />
</Form.Item>

      )}
    </>
  )
}


  ]

const next = async () => {
  try {
    const map = [
      ['businessSector'],
      ['businessStory'],
      ['companyInfo'],
      ['palette'],
      ['differential'],
      ['keyItems'],
      ['contactWhatsapp'],
      []
    ];

    await form.validateFields(map[current] || []);
    if (current < steps.length - 1) {
      setCurrent(c => c + 1);
    } else {
      form.submit();
    }
  } catch (err) {
    // Aquí puedes mostrar el error (AntD ya lo muestra en el campo)
  }
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

  // 3️⃣ Genera el slug ÚNICO a partir del nombre de la empresa
const rawName = values.companyInfo.split(',')[0]
const slug = await getUniqueSlug(rawName, db);

    // 4️⃣ OBTÉN EL LEAD PHONE CORRECTO
    const leadPhoneValue = cleanedUrlPhone || (values.leadPhone || '').trim()

    // 5️⃣ Construye el objeto a guardar
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
      slug,
      createdAt:       Timestamp.now(),
      
      status:          'Sin procesar',
      leadPhone:       leadPhoneValue, // <--- aquí ya existe la variable!
    }

    // 6️⃣ Guarda en Firestore
    const docRef = await addDoc(collection(db, 'Negocios'), negocio)

    // 7️⃣ Mensaje de éxito y redirección
    message.success(`¡Brief guardado! Tu página estará disponible en /${slug}`)
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
      type="ghost"
      className={styles.continueButton}
      onClick={next}
      icon={<ArrowRightOutlined />}
    >
      Continuar
    </Button>
  ) : (
    <Button
      type="ghost"
      className={styles.continueButton}
      onClick={next} // <-- Aquí
      disabled={
        urlPhone 
          ? (!!urlPhoneError || !phoneChecked)
          : false
      }
      icon={<ArrowRightOutlined />}
    >
      Confirmar
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
