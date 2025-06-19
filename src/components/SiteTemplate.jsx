// src/components/SiteTemplate.jsx
import React, { useState } from 'react'
import {
  Layout,
  Button,
  Row,
  Col,
  Card,
  Drawer,
  Grid,
  Form,
  Input
} from 'antd'
import {
  MenuOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined
} from '@ant-design/icons'
import * as AntIcons from '@ant-design/icons'
import HeroCTA from '../components/HeroCTA'


// Util para aclarar un color HEX en un porcentaje dado (0–1)
function lighten(hex, percent) {
  const c = hex.replace('#','')
  const num = parseInt(c,16)
  const r = Math.min(255, ((num>>16)&0xff) + 255*percent) >> 0
  const g = Math.min(255, ((num>>8)&0xff)  + 255*percent) >> 0
  const b = Math.min(255, (num&0xff)         + 255*percent) >> 0
  return `#${((r<<16)|(g<<8)|b).toString(16).padStart(6,'0')}`
}

function isDarkColor(hex) {
  if (!hex) return false
  const c = hex.replace(/^#/, '')
  const r = parseInt(c.substr(0,2),16)
  const g = parseInt(c.substr(2,2),16)
  const b = parseInt(c.substr(4,2),16)
  return (0.299*r + 0.587*g + 0.114*b)/255 < 0.5
}

export default function SiteTemplate(props) {
  // "props.schema" es el doc completo de Firestore
  const docData = props.schema
  // "site" es lo que generó la IA en docData.schema, o directamente docData para demo
  const site    = docData.schema || docData
 // 1) Extrae el WhatsApp (viene en la raíz del doc)
 const rawWhatsApp = docData.contactWhatsapp || site.contact?.whatsapp || ''
 // 2) Normalízalo dejando solo dígitos
 const whatsapp    = rawWhatsApp.replace(/\D/g, '')

  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const [drawerVisible, setDrawerVisible] = useState(false)

    // — dentro de SiteTemplate, justo después de tus hooks y antes del return
  const handleFooterSubmit = values => {
    const to     = site.contact.email
    const subj   = `Contacto desde ${site.slug}`
    const body   = 
      `Nombre: ${values.firstName} ${values.lastName}\n` +
      `Email: ${values.email}\n` +
      `Teléfono: ${values.phone}\n\n` +
      values.message
    // abre el mail client
    window.location.href =
      `mailto:${to}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`
  }

  
  // Determinamos de una vez la URL del logo: siempre mira la raíz del doc
  const logoSrc = 
       docData.logoURL  ||    // <- tu campo en Firestore
       docData.logoUrl  ||    // <- solo por si acaso usaste camelCase
       '';

  if (!site || !site.hero) {
    return (
      <div style={{
        textAlign: 'center',
        marginTop: 100,
        fontFamily: "'Work Sans', sans-serif"
      }}>
        Cargando…
      </div>
    )
  }

  // Palette (o campos individuales)
  const {
    primary   = '#1890ff',
    secondary = '#ffffff',
    accent    = '#f0f0f0',
    text      = '#333333'
  } = site.colors || {}

  // roles semánticos para armonizar
  const semantic = {
    brand:       primary,
    emphasis:    secondary,
    accent:      accent,
    textOnLight: text,
    textOnDark:  isDarkColor(accent) ? '#fff' : '#000',
    lightBg:     '#ffffff',
    softBg:      lighten(accent, 0.3)
  }

  const heroTextColor     = isDarkColor(semantic.emphasis) ? '#fff' : '#000'
  const productsTextColor = isDarkColor(semantic.emphasis) ? '#fff' : '#000'
  const baseFont          = { fontFamily: "'Work Sans', sans-serif" }
  const { Header, Content, Footer } = Layout

  return (
    <Layout style={{ minHeight: '100vh', ...baseFont }}>
      {/* NAVBAR */}
      <Header style={{
        position:       'fixed',
        top:            0,
        width:          '100%',
        background:     'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 2rem',
        zIndex:         1000
      }}>
        {/* Logo siempre desde la raíz del doc */}
        <div style={{ flex: '0 0 auto' }}>
          {logoSrc && (
            <img
              src={logoSrc}
              alt="logo"
              style={{ height: 48 }}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          )}
        </div>

        {/* Menú */}
        {isMobile ? (
          <>
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize:24, color: semantic.brand }} />}
              onClick={()=>setDrawerVisible(true)}
            />
            <Drawer
              placement="right"
              onClose={()=>setDrawerVisible(false)}
              visible={drawerVisible}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ padding:'2rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                {site.menu.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={()=>setDrawerVisible(false)}
                    style={{
                      color:       semantic.brand,
                      fontSize:    '1.25rem',
                      fontWeight:  500,
                      textDecoration:'none',
                      ...baseFont
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <div style={{ marginTop:'2rem', display:'flex', gap:'1rem' }}>
                  {site.contact.facebook  && <a href={site.contact.facebook}  target="_blank" rel="noreferrer"><FacebookOutlined  style={{ fontSize:24, color:semantic.brand }}/></a>}
                  {site.contact.instagram && <a href={site.contact.instagram} target="_blank" rel="noreferrer"><InstagramOutlined style={{ fontSize:24, color:semantic.brand }}/></a>}
                  {site.contact.youtube   && <a href={site.contact.youtube}   target="_blank" rel="noreferrer"><YoutubeOutlined   style={{ fontSize:24, color:semantic.brand }}/></a>}
                </div>
              </div>
            </Drawer>
          </>
        ) : (
          <>
            <div style={{ flex:1, display:'flex', justifyContent:'center', gap:'2rem' }}>
              {site.menu.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    color:        semantic.brand,
                    fontWeight:   500,
                    fontSize:     '1rem',
                    textDecoration:'none',
                    ...baseFont
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div style={{ display:'flex', gap:'1rem' }}>
              {site.contact.facebook  && <a href={site.contact.facebook}  target="_blank" rel="noreferrer"><FacebookOutlined  style={{ fontSize:20, color:semantic.brand }}/></a>}
              {site.contact.instagram && <a href={site.contact.instagram} target="_blank" rel="noreferrer"><InstagramOutlined style={{ fontSize:20, color:semantic.brand }}/></a>}
              {site.contact.youtube   && <a href={site.contact.youtube}   target="_blank" rel="noreferrer"><YoutubeOutlined   style={{ fontSize:20, color:semantic.brand }}/></a>}
            </div>
          </>
        )}
      </Header>

      {/* CONTENIDO */}
      <Content style={{ marginTop:64 }}>
        {/* HERO */}
        <section
          id="hero"
          style={{
            position:          'relative',
            backgroundImage:   `url(${site.hero.backgroundImageUrl})`,
            backgroundSize:    'cover',
            backgroundPosition:'center',
            textAlign:         'center',
            padding:           '6rem 2rem'
          }}
        >
          <div style={{
            position:       'absolute',
            top:            0,
            right:          0,
            bottom:         0,
            left:           0,
            backgroundColor: `${semantic.emphasis}BB`,
            zIndex:         1
          }}/>
          <div style={{ position:'relative', zIndex:2 }}>
          <h1 style={{
  fontSize:     '3.5rem',
  fontWeight:   700,
  marginBottom: 16,
  color:        heroTextColor,
   marginBottom: 8,
lineHeight:   '1.1',   
}}>
  {site.hero.title}
</h1>
<p style={{
  fontSize:   '1.25rem',
  maxWidth:   700,
  margin:     '0 auto 2rem',
  color:      heroTextColor
}}>
  {site.hero.subtitle}
</p>
    <HeroCTA
        text={site.hero.ctaText}
         href={`https://wa.me/${whatsapp}`}
         primary={semantic.brand}
         accent={semantic.accent}
       />

          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{
          background: semantic.softBg,
          padding:    '4rem 2rem',
          textAlign:  'center'
        }}>
          <h2 style={{
            color:        semantic.brand,
            fontSize:     '2.5rem',
            fontWeight:   600,
            marginBottom: 32
          }}>
            {site.features.title}
          </h2>
          <Row gutter={[24,24]} justify="center">
           {site.features.items.map((f, i) => {
  // Busca el componente de icono en el objeto
  const IconCmp = AntIcons[f.icon] || null

  return (
    <Col key={i} xs={24} md={8}>
      <Card
        bordered={false}
        style={{ borderRadius: 12, background: semantic.lightBg }}
        bodyStyle={{ padding: '2rem', textAlign: 'center' }}
      >
        {IconCmp && (
          <IconCmp
            style={{
              fontSize: 36,
              color: semantic.brand,
              marginBottom: '1rem'
            }}
          />
        )}
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: semantic.brand,
          marginBottom: 12
        }}>
          {f.title}
        </h3>
        <p style={{ color: semantic.textOnDark }}>
          {f.text}
        </p>
      </Card>
    </Col>
  )
})}

          </Row>
        </section>

       <section id="products" style={{ background: semantic.emphasis, padding: '4rem 2rem', textAlign: 'center' }}>
  <h2 style={{
    color:      productsTextColor,
    fontSize:   '2.5rem',
    fontWeight: 600,
    marginBottom:32
  }}>
    {site.products.title}
  </h2>
  <Row gutter={[24,24]} justify="center">
    {site.products.items.map((p,i) => (
      <Col key={i} xs={24} md={8}>
        <Card
          hoverable
          cover={p.imageUrl && (
            <img
              alt={p.title}
              src={p.imageUrl}
              style={{ objectFit:'cover', height:220, borderRadius:'12px 12px 0 0' }}
            />
          )}
          style={{ borderRadius:12, overflow:'hidden' }}
          bodyStyle={{ padding:'1.5rem' }}
        >
          <h3 style={{
            fontWeight:600,
            fontSize: '1.25rem',
            color: semantic.brand,
            marginBottom:8
          }}>
            {p.title}
          </h3>
          <p style={{ color: semantic.textOnDark }}>{p.text}</p>
          {/* botón WhatsApp */}
          <HeroCTA
  text={p.buttonText}
  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`¡Hola! Me interesa ${p.title}`)}`}
  primary={semantic.brand}
  accent={semantic.accent}
/>
        </Card>
      </Col>
    ))}
  </Row>
</section>

        {/* ABOUT */}
        <section id="about" style={{
          background: semantic.lightBg,
          padding:    '4rem 2rem',
          textAlign:  'center'
        }}>
          <h2 style={{
            color:         semantic.brand,
            fontSize:      '2.5rem',
            fontWeight:    600,
            marginBottom:  16
          }}>
            {site.about.title}
          </h2>
          <p style={{
            color:       semantic.textOnDark,
            maxWidth:    700,
            margin:      '0 auto',
            fontSize:    '1rem',
            lineHeight:  1.6
          }}>
            {site.about.text}
          </p>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" style={{
          background: semantic.softBg,
          padding:    '4rem 2rem',
          textAlign:  'center'
        }}>
          <h2 style={{
            color:        semantic.brand,
            fontSize:     '2.5rem',
            fontWeight:   600,
            marginBottom: 32
          }}>
            {site.testimonials.title}
          </h2>
          <Row gutter={[24,24]} justify="center">
            {site.testimonials.items.map((t,i) => (
              <Col key={i} xs={24} md={12}>
                <Card
                  bordered={false}
                  style={{ background:semantic.emphasis, borderRadius:12 }}
                  bodyStyle={{ padding:'2rem', fontStyle:'italic' }}
                >
                  <p style={{ color:semantic.textOnLight }}>“{t.text}”</p>
                  <p style={{ color:semantic.brand, fontWeight:600, marginTop:16 }}>— {t.author}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>

          {/* FOOTER */}
<Footer style={{
  background: semantic.brand,
  color:      semantic.textOnLight,
  padding:    '4rem 2rem'
}}>
  <Row gutter={32}>
    {/* Columna de info y redes */}
    <Col xs={24} md={8}>
      <h3 style={{ color: semantic.textOnLight, marginBottom: 16 }}>
        {site.companyInfo}
      </h3>
      {/*
        Aquí extraemos el email de la raíz:
        docData.contactEmail => el campo que guardaste en Firestore
      */}
      {docData.contactEmail && (
        <p style={{ color: semantic.textOnLight }}>
          Email:{' '}
          <a
            href={`mailto:${docData.contactEmail}`}
            style={{ color: semantic.textOnLight }}
          >
            {docData.contactEmail}
          </a>
        </p>
      )}
      {site.contact.whatsapp && (
        <p style={{ color: semantic.textOnLight }}>
          WhatsApp:{' '}
          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: semantic.textOnLight }}
          >
            {site.contact.whatsapp}
          </a>
        </p>
      )}
      <div style={{ marginTop: 16 }}>
        {site.contact.facebook && (
          <a
            href={site.contact.facebook}
            target="_blank"
            rel="noreferrer"
            style={{ marginRight: 12 }}
          >
            <FacebookOutlined style={{ fontSize: 20, color: semantic.textOnLight }} />
          </a>
        )}
        {site.contact.instagram && (
          <a
            href={site.contact.instagram}
            target="_blank"
            rel="noreferrer"
            style={{ marginRight: 12 }}
          >
            <InstagramOutlined style={{ fontSize: 20, color: semantic.textOnLight }} />
          </a>
        )}
        {site.contact.youtube && (
          <a
            href={site.contact.youtube}
            target="_blank"
            rel="noreferrer"
          >
            <YoutubeOutlined style={{ fontSize: 20, color: semantic.textOnLight }} />
          </a>
        )}
      </div>
    </Col>

    {/* Columna de navegación */}
    <Col xs={24} md={8}>
      <h3 style={{ color: semantic.textOnLight, marginBottom: 16 }}>
        Enlaces
      </h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {site.menu.map(item => (
          <li key={item.id} style={{ marginBottom: 8 }}>
            <a
              href={`#${item.id}`}
              style={{ color: semantic.textOnLight, textDecoration: 'none' }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Col>

    {/* Columna de formulario */}
    <Col xs={24} md={8}>
      <h3 style={{ color: semantic.textOnLight, marginBottom: 16 }}>
        Déjanos un mensaje
      </h3>
      <Form layout="vertical" onFinish={handleFooterSubmit}>
        <Form.Item
          name="firstName"
          label={<span style={{ color: semantic.textOnLight }}>Nombre*</span>}
          rules={[{ required: true, message: 'Ingresa tu nombre' }]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label={<span style={{ color: semantic.textOnLight }}>Apellido*</span>}
          rules={[{ required: true, message: 'Ingresa tu apellido' }]}
        >
          <Input placeholder="Apellido" />
        </Form.Item>
        <Form.Item
          name="email"
          label={<span style={{ color: semantic.textOnLight }}>Email*</span>}
          rules={[
            { required: true, message: 'Ingresa tu email' },
            { type: 'email', message: 'Formato inválido' }
          ]}
        >
          <Input placeholder="correo@ejemplo.com" />
        </Form.Item>
        <Form.Item
          name="phone"
          label={<span style={{ color: semantic.textOnLight }}>Teléfono*</span>}
          rules={[{ required: true, message: 'Ingresa tu teléfono' }]}
        >
          <Input placeholder="+52 1 234 567 8900" />
        </Form.Item>
        <Form.Item
          name="message"
          label={<span style={{ color: semantic.textOnLight }}>Mensaje*</span>}
          rules={[{ required: true, message: 'Escribe tu mensaje' }]}
        >
          <Input.TextArea rows={4} placeholder="¿En qué te podemos ayudar?" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              borderRadius: 999,
              background:   semantic.textOnLight,
              color:        semantic.brand,
              border:       'none'
            }}
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </Col>
  </Row>

  <div style={{
    textAlign: 'center',
    marginTop: '2rem',
    color: semantic.textOnLight
  }}>
    © {new Date().getFullYear()} {site.slug || site.companyInfo}. Todos los derechos reservados.
  </div>
</Footer>


    </Layout>
  )
}
