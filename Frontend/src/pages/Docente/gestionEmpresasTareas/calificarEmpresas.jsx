import { useState, useEffect } from 'react';
import { styled } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { getEmpresasDocente } from '../../../api/getEmpresasDocente';
import { useNavigate, useParams } from 'react-router-dom';
import BaseUI from '../../../components/baseUI/baseUI';

const CalificarEmpresas = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [docente, setDocente] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { idDocente } = useParams(); 

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await getEmpresasDocente(idDocente); 
        setDocente(data.docente); 
        setEmpresas(data.empresas); 
        setFilteredEmpresas(data.empresas);
      } catch (error) {
        console.error('Error al obtener las empresas:', error.message);
        setError(`Error al obtener las empresas: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, [idDocente]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = empresas.filter(
      (empresa) =>
        empresa.nombreEmpresa.toLowerCase().includes(term) ||
        empresa.nombreLargo.toLowerCase().includes(term)
    );

    setFilteredEmpresas(filtered);
  };

  const handleRowClick = (idEmpresa) => {
    navigate(`/grupoDocente/calificarTareasEmpresas/empresas/${idEmpresa}/${idDocente}/sprints`); // Cambiar la ruta según tu implementación
  };

  return (
    <BaseUI
      titulo={'CALIFICAR TAREAS'}
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={'/'} 
      loading={loading}
      error={{error:error}}
    >
      <DocenteInfoWrapper>
        <DocenteName>{`Docente: ${docente}`}</DocenteName>
      </DocenteInfoWrapper>

      <SearchWrapper>
        <TextField
          label="Buscar empresa..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          size="small" // Ajustar el tamaño del campo
        />
      </SearchWrapper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Nombre Empresa</TableCell>
              <TableCell align="left">Nombre Largo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmpresas.length > 0 ? (
              filteredEmpresas.map((empresa) => (
                <TableRow
                  key={empresa.idEmpresa}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                  onClick={() => handleRowClick(empresa.idEmpresa)}
                >
                  <TableCell component="th" scope="row" align="left">
                    {empresa.nombreEmpresa}
                  </TableCell>
                  <TableCell align="left">{empresa.nombreLargo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No se encontraron empresas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </BaseUI>
  );
};

export default CalificarEmpresas;

const SearchWrapper = styled('div')`
  margin: 1rem 0;
  display: flex;
  justify-content: left; /* Centrar el campo de búsqueda horizontalmente */
`;

const DocenteInfoWrapper = styled('div')`
  display: flex;
  justify-content: flex-end; /* Alinear el nombre del docente a la derecha */
  margin-bottom: 1rem;
`;

const DocenteName = styled('h3')`
  font-weight: bold;
`;
