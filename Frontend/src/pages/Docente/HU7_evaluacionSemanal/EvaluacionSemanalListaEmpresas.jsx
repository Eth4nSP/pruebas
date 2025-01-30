const apiHost = import.meta.env.VITE_HOST;
import { useEffect, useState } from "react";
import ListaDefinitivaN from '../../../components/listaDefinitiva/listaDefinitivaN'

const columns = [
    {
      field: 'nombreEmpresa',
      headerName: 'Nombre Empresa',
      type: 'string',
      flex: 2,
    },
    {
      field: 'nombreLargo',
      headerName: 'Nombre Empresa largo',
      type: 'string',
      flex: 2,
    }
];
const idGrupo = localStorage.getItem("idGrupo")
function ListaEmpresasEvaluacionSemanal() {
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    errorMessage: "",
    errorDetails: "",
  });
  const [listaEmpresas, setListaEmpresas] = useState()
  useEffect(() => {
    setLoading(true);
    const fetchEmpresas = async () => {
      try {
        const url = `${apiHost}/empresasSinSemanaCalificada`
        const body = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        }
        const response = await fetch(url, body)
        if(response.ok){
          const lista = await response.json()  
          setListaEmpresas(lista);
          console.log(lista);
        }
        
        setLoading(false);
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
        titulo="SELECCIONE UNA EMPRESA PARA EL SEGUIMIENTO SEMANAL"
        cabezeraTitulo={null}
        cabezeras={columns}
        datosTabla={listaEmpresas}
        ocultarAtras={false}
        confirmarAtras={false} 
        dirBack={`/homeDocente`}
        dirForward= {`/homeDocente/listaEmpresasEvaluacionSemanal/empresaSprints`}
        mensajeSearch="Buscar Grupo Empresa"
        nombreContador="GRUPOS"
        loading={loading}
        error={error}
    >
        
    </ListaDefinitivaN>
  );
}

export default ListaEmpresasEvaluacionSemanal;