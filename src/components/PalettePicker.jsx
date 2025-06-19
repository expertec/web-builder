// src/components/PalettePicker.jsx
import React from 'react'
import { Card, Row, Col } from 'antd'

export default function PalettePicker({ palettes, value, onChange }) {
  return (
    <Row gutter={[16, 16]}>
      {palettes.map((palette, idx) => {
        const isActive = value === idx
        return (
          <Col key={idx} span={6}>
            <Card
              hoverable
              onClick={() => onChange(idx)}
              bodyStyle={{
                padding: 0,
                display: 'flex',
                border: isActive ? '2px solid #2e006b' : '2px solid transparent',
                borderRadius: 4,
                overflow: 'hidden'
              }}
            >
              {palette.map((color, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 40,
                    backgroundColor: color
                  }}
                />
              ))}
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}
