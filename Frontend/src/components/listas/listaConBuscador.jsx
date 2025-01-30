import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { 
  DataGrid, 
  GridToolbar 
} from '@mui/x-data-grid';
import { 
  Autocomplete, 
  TextField, 
  Paper, 
  Typography,
  Container,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledContainer = styled(Container)(({ theme }) => ({
  '& .search': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  '& .search_input': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .search_icon': {
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1),
  },
  '& .alerta': {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.error.main,
  },
  '& .search_input--h2': {
    fontSize: 'calc(1vw + 0.8rem)',
  },
}));

function ListaConBuscador({ 
  columnas, 
  datosTabla,
  dirForward,
  mensajeSearch,
  nombreContador 
}) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [notFound, setNotFound] = useState('');

  const paginationModel = { page: 0, pageSize: 10 };

  const handleRowClick = (id) => {
    if (dirForward) {
      navigate(`${dirForward}${id}`);
    }
  };

  const filtered = datosTabla.filter((data) => {
    const nombreCompleto = `${data.nombreEstudiante} ${data.apellidoPaternoEstudiante} ${data.apellidoMaternoEstudiante}`.toLowerCase();
    const nombreEmpresa = data.nombreEmpresa?.toLowerCase() || '';
    return (
      nombreCompleto.includes(searchValue.toLowerCase()) || 
      nombreEmpresa.includes(searchValue.toLowerCase()) ||
      data.totalEstudiantes?.toString().includes(searchValue)
    );
  });

  useEffect(() => {
    if (filtered.length === 0) {
      if (searchValue.trim() === '') {
        setNotFound('');
      } else {
        setNotFound('No se encontraron resultados que coincidan con la búsqueda');
      }
    } else {
      setNotFound('');
    }
  }, [searchValue, filtered.length]);

  return (
    <StyledContainer>
      <Box className="search">
        <Box className="search_input">
          <Autocomplete
            freeSolo
            disablePortal
            disableListWrap
            options={[]}
            inputValue={searchValue} 
            onInputChange={(event, newValue) => setSearchValue(newValue)} 
            sx={{ width: 'calc(10vw + 6rem)' }}
            renderInput={(params) => <TextField {...params} label={mensajeSearch} />}
          />
          <SearchIcon className="search_icon" />
        </Box>
        <Typography variant="h6" className="search_input--h2">
          {nombreContador ? `${datosTabla.length} ${nombreContador}` : ""}
        </Typography>
      </Box>

      <Paper elevation={3}>
        <DataGrid
          rows={filtered}
          columns={columnas}
          getRowId={(row) => row.id}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20]}
          disableColumnMenu
          hideFooterSelectedRowCount
          hideFooterPagination={notFound || filtered.length < paginationModel.pageSize}
          onRowClick={(params) => handleRowClick(params.id)}
          sortingOrder={['asc', 'desc']} 
          disableColumnResize
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Paper>

      {notFound && (
        <Box className="alerta">
          <Typography variant="h6" color="error">{notFound}</Typography>
        </Box>
      )}
    </StyledContainer>
  );
}

export default ListaConBuscador;