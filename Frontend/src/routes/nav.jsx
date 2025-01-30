import { Routes, Route, Navigate } from 'react-router-dom';
import IniciarSesion from "../pages/Home/iniciarSesion.jsx";
import CrearCuentaEstudiante from '../pages/Home/crearCuentaEstudiante.jsx';
import IniciarSesionAdmin from '../pages/Home/iniciarSesionAdmin.jsx';
import RecuperarContraseña from '../pages/Home/recuperarContraseña.jsx'
function Nav() {
  return (
    <Routes>
      
      <Route path="/crearCuentaEstudiante" element={<CrearCuentaEstudiante />} />
      <Route path="/" element={<IniciarSesion />} />
      <Route path="/estoTieneQueSerUnLinkRandomSuperLargo" element={<IniciarSesionAdmin />} />  
      <Route path='/RecuperarContraseña'element={<RecuperarContraseña />}/>


      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default Nav;
