// src/pages/SitePage.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import SiteTemplate from '../components/SiteTemplate'

export default function SitePage() {
  const { slug } = useParams()
  const [docData, setDocData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'Negocios'),
          where('slug', '==', slug),
          where('status', '==', 'Procesado')
        )
        const snap = await getDocs(q)
        if (snap.empty) {
          message.error(`No encontré ningún negocio con slug “${slug}”`)
          setDocData(null)
          return
        }
        const data = snap.docs[0].data()
        if (!data.schema) {
          message.error('Este negocio aún no tiene schema generado.')
          setDocData(null)
          return
        }
        // guardamos TODO el documento, no solo data.schema
        setDocData(data)
      } catch (err) {
        console.error(err)
        message.error('Error cargando los datos del negocio.')
        setDocData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return <Spin style={{ margin: '4rem auto', display: 'block' }} />
  }

  if (!docData) {
    // ya mostramos mensaje de error arriba
    return null
  }

  // le pasamos TODO el documento para que SiteTemplate pueda leer logoURL, schema, etc.
  return <SiteTemplate schema={docData} />
}
