import ListaDefinitivaN from "../../../../components/listaDefinitiva/listaDefinitivaN";
import { useEffect, useState } from "react";
import { getPlanificacionesParaModificar} from "../../../../api/listas/listasEmpresas";

const columns = [
  {
    field: "nombreEmpresa",
    headerName: "Nombre Empresa",
    type: "string",
    flex: 2,
  },
  {
    field: "nombreLargo",
    headerName: "Nombre Empresa largo",
    type: "string",
    flex: 2,
  },
];
function SeleccionarEmpresaModificar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    errorMessage: "",
    errorDetails: "",
  });
  const [listaEmpresas, setListaEmpresas] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await getPlanificacionesParaModificar();
        console.log(responseData);
      if (responseData.error !== undefined && responseData.error !== null) {
        setError({
          errorMessage: "Ha ocurrido un error",
          errorDetails: error.message,
        });
      } else {
        const [lista] = await responseData;
        setListaEmpresas(lista);
        console.log(lista);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <ListaDefinitivaN
      titulo="SELECCIONE UNA EMPRESA PARA MODIFICAR"
      cabezeraTitulo={null}
      cabezeras={columns}
      datosTabla={listaEmpresas}
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={`/homrDocente`}
      dirForward= {`/modificarPlanificacion/empresa/`}
      mensajeSearch = "Buscar empresa"
      nombreContador = "Empresas"
      loading={loading}
      error={error}
    />
  );
}

export default SeleccionarEmpresaModificar;
