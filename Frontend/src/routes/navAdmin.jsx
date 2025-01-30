import { Routes, Route, Navigate } from 'react-router-dom';
import CrearCuentaDocente from '../pages/Home/crearCuentaDocente.jsx';
import HomeAdmin from '../pages/Admin/homeAdmin.jsx';
function NavAdmin() {
  return (
    <Routes>
      <Route path="/" element={<HomeAdmin />} />
      <Route path="/crearCuentaEstudiante" element={<CrearCuentaDocente />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default NavAdmin;
