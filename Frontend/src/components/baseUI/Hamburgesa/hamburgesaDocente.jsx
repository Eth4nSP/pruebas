import { Drawer, Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import ReportIcon from '@mui/icons-material/Report';

// eslint-disable-next-line react/prop-types
function HamburgesaDocente({ open, toggleDrawer }) {
  const navigate = useNavigate(); 
  const fechaLimiteEntregaEmpresa = new Date(localStorage.getItem("fechaLimiteEntregaEmpresa"))
  const paso = fechaLimiteEntregaEmpresa < new Date()
  const fechaLimiteEntregaPlani = new Date(localStorage.getItem("fechaLimiteEntregaPlanificacion"))
  const paso2 = fechaLimiteEntregaPlani < new Date()
  const menuItems = [
    ...(paso?[{ text: 'Visualizar Planificaciones', icon: <AssignmentIcon />, path: '/noTieneNada' }]:[]),
    ...(paso2?[{ text: 'Visualizar Seguimiento Semanal', icon: <CalendarTodayIcon />, path: '/homeDocente/listaEmpresaCalificaciones' }]:[]),
    { text: 'Lista de Estudiantes', icon: <PeopleIcon />, path: '/homeDocente/listaEstudiantes'  },
    { text: 'Lista de Grupo-Empresas', icon: <GroupIcon />, path: '/homeDocente/listaEmpresas' },
    { text: 'Calificaciones', icon: <StarIcon />, path: '/calificaciones' },
    { text: 'Reportes', icon: <ReportIcon />, path: '/reportes' },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => toggleDrawer(false)}
    >
      <Box sx={{ width: 250 }}>
        <Typography variant="h6" sx={{ padding: '16px', backgroundColor: '#114093', color: 'white' }}>
          Herramientas
        </Typography>

        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => navigate(item.path)} 
              sx={{borderBottom:'solid 0.01rem grey', borderRadius:'0.8rem', 
                boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.3)', // Sombra específicamente abajo
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default HamburgesaDocente;
