import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Error from '../../../components/error/error';
import ListaDefinitivaN from '../../../components/listaDefinitiva/listaDefinitivaN';
import { getPlanificacionesAceptadas } from "../../../api/getPlanificacionesAceptadas";
const columns = [
  { field: 'nombreEmpresa', headerName: 'Nombre Empresa', type: 'string', flex: 2 },
  { field: 'nombreLargo', headerName: 'Nombre Empresa largo', type: 'string', flex: 2 }
];

function EmpresasParaTareas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorDetails: "",
  });

  useEffect(() => {
    setLoading(true);
    const fetchEmpresas = async () => {
      try {
        const result = await getPlanificacionesAceptadas();
        if (!result) throw new Error("No se encontraron datos");
        setData(result);
      } catch (err) {
        setError({
          error: true,
          errorMessage: err.message,
          errorDetails: err,
        });
      } finally {
        setLoading(false);
      }
    };    
    fetchEmpresas();
  }, []);

  return (
    <ListaDefinitivaN
      titulo="SELECCIONE UNA EMPRESA PARA VISUALIZAR SUS TAREAS"
      cabezeraTitulo={null}
      cabezeras={columns}
      datosTabla={data}
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack="/homeDocente"
      dirForward= {`/homeDocente/listaEmpresasVerTareas/sprints`}
      mensajeSearch="Buscar Empresa"
      nombreContador="Empresas"
      loading={loading}
      error={error}
    />
  );
}

export default EmpresasParaTareas;
