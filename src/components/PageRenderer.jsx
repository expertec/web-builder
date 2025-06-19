// src/components/PageRenderer.jsx
import React from 'react'

export default function PageRenderer({ schema }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: schema.hero?.bgColor || '#fff', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>{schema.hero?.title}</h1>
        <p>{schema.hero?.subtitle}</p>
      </section>

      {/* Servicios */}
      {schema.services?.items?.length > 0 && (
        <section id="services" style={{ padding: '2rem' }}>
          <h2>{schema.services.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {schema.services.items.map((item, i) => (
              <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
                {item.imageURL && <img src={item.imageURL} alt={item.title} style={{ width: '100%', borderRadius: 4 }} />}
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contacto */}
      <section id="contact" style={{ padding: '2rem', background: '#fafafa' }}>
        <h2>Contáctanos</h2>
        <p>
          WhatsApp:{' '}
          <a
            href={`https://wa.me/${schema.contactWhatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
          >
            {schema.contactWhatsapp}
          </a>
        </p>
        <p>
          Email:{' '}
          <a href={`mailto:${schema.contactEmail}`}>
            {schema.contactEmail}
          </a>
        </p>
        {schema.socialFacebook && (
          <p>Facebook: <a href={schema.socialFacebook}>{schema.socialFacebook}</a></p>
        )}
        {schema.socialInstagram && (
          <p>Instagram: <a href={schema.socialInstagram}>{schema.socialInstagram}</a></p>
        )}
      </section>
    </div>
  )
}
