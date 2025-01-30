import Nav from './routes/nav'
import NavDocente from './routes/navDocente'
import NavEstudiante from './routes/navEstudiante'
import NavAdmin from './routes/navAdmin'
import Cookies from 'js-cookie';
import './App.css'
import { decrypt } from './api/decrypt';
function App() {
  const userRole = Cookies.get('random');
  if (userRole) {
    const decryptedRole = decrypt(userRole);
    if (decryptedRole === 'docente') {
      return <NavDocente />;
    }
    if (decryptedRole === 'estudiante') {
      return <NavEstudiante />;
    }
    if (decryptedRole === 'administrador') {
      return <NavAdmin />;
    }
  }
  return <Nav />;
}

export default App;
