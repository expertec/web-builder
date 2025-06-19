// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import StepForm from './Pages/StepForm';
import Login from './Pages/Login';
import Desktop from './Pages/Desktop';
import ProtectedRoute from './components/ProtectedRoute';
import BriefWizard from './Pages/BriefWizard';
import SitePage from './Pages/SitePage';  // ← importa el renderer de sitios
import { Toaster } from 'sonner';

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
         <Toaster richColors position="top-center" />
      <Content style={{ padding: 0 }}>
        <Routes>
          {/* Pantalla del wizard */}
        
            {/* Pantalla del wizard, con parámetro opcional `phone` */}
       

          {/* Previsualización de sitio generado */}
          <Route path="/site/:slug" element={<SitePage />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta protegida */}
          <Route
            path="/desktop"
            element={
              <ProtectedRoute>
                <Desktop />
              </ProtectedRoute>
            }
          />
               <Route path="/:phone?" element={<BriefWizard />} />
                 <Route path="/" element={<BriefWizard />} />

          {/* Cualquier otra ruta redirige a / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
