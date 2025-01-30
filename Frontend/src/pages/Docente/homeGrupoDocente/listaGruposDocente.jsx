import { Fragment, useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Select, MenuItem, FormControl, InputLabel, Card, CardContent, styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/baseUI/Header/header.jsx';
import Footer from '../../../components/baseUI/Footer/footer.jsx';
import Loading from '../../../components/loading/loading.jsx';

const apiHost = import.meta.env.VITE_HOST;

function ListaGruposDocente() {
  const [gruposEnCurso, setGruposEnCurso] = useState([]);
  const [gruposPasados, setGruposPasados] = useState([]);
  const [filteredGrupos, setFilteredGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch(`${apiHost}/docente/visualizarSemestres`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        const fechaActual = new Date();

        const enCurso = data.filter((grupo) => new Date(grupo.fechaFinGestion) >= fechaActual);
        const pasados = data.filter((grupo) => new Date(grupo.fechaFinGestion) < fechaActual);

        setGruposEnCurso(enCurso);
        setGruposPasados(pasados);
        setFilteredGrupos(pasados);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los grupos:', error);
      }
    };

    fetchGrupos();
  }, []);

  const handleYearFilterChange = (event) => {
    const selectedYear = event.target.value;
    setYearFilter(selectedYear);

    if (selectedYear) {
      const filtered = gruposPasados.filter((grupo) => {
        const year = new Date(grupo.fechaFinGestion).getFullYear();
        return year === parseInt(selectedYear, 10);
      });
      setFilteredGrupos(filtered);
    } else {
      setFilteredGrupos(gruposPasados);
    }
  };

  const handleClick = (idGrupo) => {
    localStorage.setItem('idGrupo', idGrupo);
    navigate('/homeDocente');
  };

  if (loading) {
    return (
      <Fragment>
        <Header />
        <Container maxWidth="lg" sx={{ paddingTop: 4, marginTop: '5rem', minHeight: '72.9vh' }}>
          <Loading />
        </Container>
        <Footer />
      </Fragment>
    );
  }

  const columns = [
    { field: 'gestionGrupo', headerName: 'Gestión', flex: 1 },
    { field: 'fechaIniGestion', headerName: 'Fecha Inicio', flex: 1 },
    { field: 'fechaFinGestion', headerName: 'Fecha Fin', flex: 1 },
    { field: 'numGrupo', headerName: 'Número de Grupo', flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClick(params.row.id)}
        >
          Seleccionar
        </Button>
      ),
      flex: 1,
    },
  ];

  const uniqueYears = [...new Set(gruposPasados.map((grupo) => new Date(grupo.fechaFinGestion).getFullYear()))];

  return (
    <Fragment>
      <Header />
      <Container maxWidth="lg" sx={{ paddingTop: 4, marginTop: '5rem', minHeight: '72.9vh' }}>
        <Typography variant="h4" gutterBottom color="blue">
          Lista de Grupos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={()=>navigate("/crearFechasLimitesGrupo")}
          sx={{ marginTop:'0.5rem', marginBottom:'0.5rem' }}
        >
          Crear grupo +
        </Button>
        <Typography variant="h5" gutterBottom>
          Grupos en Curso
        </Typography>
        <Grid container spacing={3}>
          {gruposEnCurso.length > 0 ? (
            gruposEnCurso.map((grupo) => (
              <Grid item xs={12} sm={6} md={4} key={grupo.id}>
                <CardHere variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{grupo.gestionGrupo} / Grupo: {grupo.numGrupo}</Typography>
                    <Typography variant="body2">
                      Fecha de Inicio: {grupo.fechaIniGestion}
                    </Typography>
                    <Typography variant="body2">
                      Fecha de Fin: {grupo.fechaFinGestion}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClick(grupo.id)}
                      sx={{ marginTop: 2 }}
                    >
                      Seleccionar
                    </Button>
                  </CardContent>
                </CardHere>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" marginTop={'1rem'} color='red'>No hay grupos en curso.</Typography>
          )}
        </Grid>

        <Typography variant="h5" gutterBottom marginTop={'1rem'}>
          Grupos Pasados
        </Typography>
        
        {gruposPasados.length > 0 ? 
        <>
          <FormControl sx={{ marginBottom: 3, minWidth: 200 }}>
          <InputLabel>Año</InputLabel>
          <Select value={yearFilter} onChange={handleYearFilterChange} label="Año">
            <MenuItem value="">Todos</MenuItem>
            {uniqueYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredGrupos.map((grupo) => ({
              ...grupo,
              id: grupo.id,
            }))}
            columns={columns}
            pageSizeOptions={[10]}
            disableColumnFilter
            disableColumnMenu
            disableColumnResize 
          />
        </div>
        </>
        : (
            <Typography variant="body1" marginTop={'1rem'} color='red'>No hay grupos pasados.</Typography>
          )}
      </Container>
      <Footer />
    </Fragment>
  );
}

export default ListaGruposDocente;
const CardHere = styled(Card)({
  height: '100%',
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  ":hover":{
    boxShadow: "0 1rem 10rem rgba(0,0,0,0.2)",
    zIndex:'1000',
    backgroundColor:'#dcdadaf'
  }
});