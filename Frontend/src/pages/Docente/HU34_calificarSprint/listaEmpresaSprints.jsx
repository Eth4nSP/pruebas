const apiHost = import.meta.env.VITE_HOST;
import { useState, useEffect } from 'react';
import ListaDefinitivaN from '../../../components/listaDefinitiva/listaDefinitivaN';
import BaseUI from '../../../components/baseUI/baseUI';
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
    },
  ];

function ListaEmpresaSprints() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({
        error:false,
        errorMessage: "",
        errorDetails: "",
    });
    const [listaEmpresas, setListaEmpresas] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const url = `${apiHost}/empresasSinSprintCalificado`
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
          } catch (error) {
            console.error("Error en la solicitud:", error.message);
            setError({
              error:true,
              errorMessage: "Ha ocurrido un error",
              errorDetails: error.message,
            });
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, []);
  if(listaEmpresas.length === 0) return (
    <BaseUI
        titulo={'SELECCIONE UNA EMPRESA PARA CALIFICAR'}
        ocultarAtras={false}
        confirmarAtras={false}
        dirBack={`/homeDocente`}
        loading={loading}
        error={error}
    >
      <div className='mensajeVacio'>
          <h1>NO HAY EMPRESAS PARA CALIFICAR SPRINTS</h1>
      </div>
    </BaseUI>
  )    
  return (
    <ListaDefinitivaN
      loading={loading}
      error={error}
      titulo="SELECCIONE UNA EMPRESA PARA CALIFICAR"
      cabezeraTitulo={null}
      cabezeras={columns}
      datosTabla={listaEmpresas}
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={`/homeDocente`}
      dirForward= {`/homeDocente/listaEmpresaCalificarSprints/empresa`}
      mensajeSearch = "Buscar empresa"
      nombreContador = "Empresas"
    />
  );
}

export default ListaEmpresaSprints;