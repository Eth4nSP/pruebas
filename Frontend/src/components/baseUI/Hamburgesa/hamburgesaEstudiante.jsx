import { Drawer, Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';

// eslint-disable-next-line react/prop-types
function HamburgesaEstudiante({ open, toggleDrawer }) {
  const navigate = useNavigate(); 
  const aceptada = localStorage.getItem('aceptada');
  const empresaPublicada = localStorage.getItem('empresaPublicada')
  const fechaLimiteEntregaEmpresa = new Date(localStorage.getItem('fechaLimiteEntregaEmpresa'))
  const paso = new Date() > fechaLimiteEntregaEmpresa
  const menuItems = [
    ...(!empresaPublicada&&paso ?[{ text: 'Visualizar Planificaciones', icon: <AssignmentIcon />, path: '/noTieneNada' }]:[]),
    ...(!aceptada ? [{ text: 'Lista de tareas Semanal', icon: <CalendarTodayIcon />, path: '/noTieneNada' }] : []),
    { text: 'Grupo-Empresas', icon: <GroupIcon />, path: '/noTieneNada' },
    { text: 'Calificaciones', icon: <StarIcon />, path: '/noTieneNada' },
  ];


  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => toggleDrawer(false)}
    >
      <Box sx={{ width: 250 }}>
        <Typography variant="h6" 
          sx={{ padding: '16px', backgroundColor: '#114093', color: 'white' }}
        >
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

export default HamburgesaEstudiante;
