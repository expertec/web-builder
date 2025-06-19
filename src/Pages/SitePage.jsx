// src/pages/SitePage.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, Alert } from 'antd'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import SiteTemplate from '../components/SiteTemplate'

export default function SitePage() {
  const { slug } = useParams()
  const [docData, setDocData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      setDocData(null)
      try {
        const q = query(
          collection(db, 'Negocios'),
          where('slug', '==', slug),
          where('status', '==', 'Procesado')
        )
        const snap = await getDocs(q)
        if (snap.empty) {
          setError(`No encontramos una página para “${slug}”.`)
          return
        }
        const data = snap.docs[0].data()
        if (!data.schema) {
          setError('La página está en proceso de creación. Vuelve más tarde.')
          return
        }
        setDocData(data)
      } catch (err) {
        setError('Error cargando los datos del negocio.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return <Spin style={{ margin: '4rem auto', display: 'block' }} tip="Cargando página..." />
  }

  if (error) {
    return (
      <div style={{ maxWidth: 420, margin: '4rem auto' }}>
        <Alert
          message={error}
          type="warning"
          showIcon
        />
      </div>
    )
  }

  return <SiteTemplate schema={docData} />
}
