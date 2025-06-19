// src/components/HeroCTA.jsx
import React, { useState } from 'react'

export default function HeroCTA({ text, href, primary, accent }) {
  const [hovered, setHovered] = useState(false)

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 3rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform .2s, box-shadow .2s',
    background: primary,
    color: accent,
    transform: hovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: hovered
      ? '0 12px 24px rgba(0,0,0,0.15)'
      : '0 0 0 rgba(0,0,0,0)',
  }

  const arrowStyle = {
    marginLeft: '.75rem',
    display: 'inline-block',
    transition: 'transform .2s',
    transform: hovered ? 'translateX(6px)' : 'translateX(0)',
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
      <button
        style={baseStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {text}
        <span style={arrowStyle}>→</span>
      </button>
    </a>
  )
}
