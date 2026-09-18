import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminUpload from './pages/AdminUpload';
import StudentFiles from './pages/StudentFiles';
import FileViewer from './pages/FileViewer';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app-container no-select">
          <Navbar />
          <main className="app-main">
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Admin Routes */}
              <Route path="/upload" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUpload />
                </ProtectedRoute>
              } />

              {/* Public File Routes */}
              <Route path="/files" element={<StudentFiles />} />
              <Route path="/view/:id" element={<FileViewer />} />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/files" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
