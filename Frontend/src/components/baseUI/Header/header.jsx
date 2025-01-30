import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Cookies from 'js-cookie';
import { useState, lazy, Suspense } from 'react';
import { decrypt } from '../../../api/decrypt';
import { logout } from '../../../api/sesionesApi';
const HamburgesaDocente = lazy(() => import('../Hamburgesa/hamburgesaDocente'));
const HamburgesaEstudiante = lazy(() => import('../Hamburgesa/hamburgesaEstudiante'));
const UserModal= lazy(() => import('../userModal/userModal'));
const apiHost = import.meta.env.VITE_HOST;
function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPerfil, setOpenPerfil] = useState(false);
  const cerrarPerfil = (openPerfil) => {
    setOpenPerfil(openPerfil);
    handleClose();
  };
  const toggleDrawer = (open) => {
    setOpen(open);
  };
  
  const logoutHeader = async () => {
      try {
          await logout()
          window.location.reload();  
      } catch (error) {
          console.error('Error al cerrar sesión:', error);
      }
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const random = Cookies.get('random');
  const role = decrypt(random);
  return (
    <Box >
      <AppBar position="fixed">
        <Toolbar>
          { '/'!== window.location.pathname && '/GruposDocente'!== window.location.pathname  ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <h5>WEB TIS</h5>
          </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountBoxIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={()=> cerrarPerfil(true)}>Profile</MenuItem>
                <MenuItem onClick={logoutHeader}>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
      <Suspense >
        {open&&(role==='docente'?
          <HamburgesaDocente open={open} toggleDrawer={toggleDrawer} />
          :role==='estudiante'?
          <HamburgesaEstudiante open={open} toggleDrawer={toggleDrawer} />
          :
          <></>
        )}
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        {openPerfil && <UserModal openPerfil={openPerfil} cerrarPerfil={cerrarPerfil} role={role} />}
      </Suspense>

    </Box>
  );
}

export default Header;

