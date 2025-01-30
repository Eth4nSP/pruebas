const apiHost = import.meta.env.VITE_HOST;
import {useState, useEffect } from 'react';
import ListaDefinitivaN from '../../../components/listaDefinitiva/listaDefinitivaN';
import Cookies from 'js-cookie';
import { decrypt } from '../../../api/decrypt';
const columns = [
  {
    field: 'nombreCompleto',
    headerName: 'Nombre',
    sortable: true,
    flex: 2,
    valueGetter: (value, row) => `${row.nombreEstudiante || ''} ${row.apellidoPaternoEstudiante || ''} ${row.apellidoMaternoEstudiante || ''}`,
  },
  {
    field: 'nombreEmpresa',
    headerName: 'Grupo Empresa',
    type: 'string',
    flex: 2,
    renderCell: ({ value }) => (
      <span style={{ color: value ? 'inherit' : 'red' }}>
        {value || 'N/A'}
      </span>
    ),
  },
];

export default function DataTable() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
    
  const userRole = Cookies.get('random');
  const decryptedRole = decrypt(userRole);
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorDetails: "",
  });
  const idGrupo = localStorage.getItem("idGrupo")
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiHost}/docente/listaEstudiantes?` +
        new URLSearchParams({
          idGrupo,
        }),{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        }
      );
      if (!response.ok) {
        console.log(response)
        const errorData = await response.json();
        console.log(errorData)
        if (errorData.message === "No se encontraron estudiantes o docentes para este grupo.") {
          setEstudiantes([]);
        } else {
          setError({
            error: true,
            errorMessage: errorData.message,
            errorDetails: errorData,
          });
        }
      }else{
        const data = await response.json();
        setEstudiantes(data);
      } 
    } catch (err) {
      console.error('Error en la solicitud:', err);
      setError({
        error: true,
        errorMessage: err.message,
        errorDetails: err,
      });
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  return (
    <ListaDefinitivaN
      titulo="LISTA DE ESTUDIANTES"
      cabezeraTitulo={null}
      cabezeras={columns}
      datosTabla={estudiantes}
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={decryptedRole === 'docente'?"/homeDocente":"/homeEstu"}
      dirForward=""
      mensajeSearch = "Buscar Estudiante o empresa"
      nombreContador = "Estudiantes"
      loading={loading}
      error={error}
    /> 
  );
}
