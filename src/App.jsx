import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import StudentInformationManagement from './pages/students/StudentInformationManagement';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('collegeERPUser'));
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem('collegeERPUser');
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/students' : '/login'} replace />} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={setUser} />} />
      <Route path="/register" element={<AuthPage mode="register" onAuth={setUser} />} />
      <Route
        path="/students"
        element={user ? <StudentInformationManagement user={user} onLogout={logout} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={user ? '/students' : '/login'} replace />} />
    </Routes>
  );
}
