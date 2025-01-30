import { useState, useEffect } from 'react';
import ListaDefinitivaN from '../../../../components/listaDefinitiva/listaDefinitivaN';
import { getPlanificacionesAceptadas } from '../../../../api/getPlanificacionesAceptadas'
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

function ListaCali() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({
        error:false,
        errorMessage: "",
        errorDetails: "",
    });
    const [listaEmpresas, setListaEmpresas] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const responseData = await getPlanificacionesAceptadas();
                console.log(responseData)
                if (responseData.error !== undefined && responseData.error !== null) {
                    setError({
                        error:true,
                        errorMessage: "Ha ocurrido un error",
                        errorDetails: error.message,
                    });
                } else{
                    setListaEmpresas(responseData);
                    console.log(responseData);
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
        fetchData();
      }, []);

  return (
    <ListaDefinitivaN
      titulo="SELECCIONE UNA EMPRESA PARA VISUALIZAR CALIFICACION"
      cabezeraTitulo={null}
      cabezeras={columns}
      datosTabla={listaEmpresas}
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={`/homeDocente`}
      dirForward= {`/homeDocente/listaEmpresaCalificaciones/empresa`}
      mensajeSearch = "Buscar empresa"
      nombreContador = "Empresas"
      loading={loading}
      error={error}
    />
  );
}

export default ListaCali;