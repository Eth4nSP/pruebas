import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { getPlanificacionesSinValidar } from "../../api/getPlanificacionesSinValidar";
import Loading from "../loading/loading";
import Error from "../error/error";
import ListaConBuscador from "./listaConBuscador";

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

function ListaEmpresasSinValidar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    errorMessage: "",
    errorDetails: "",
  });
  const [listaEmpresas, setListaEmpresas] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await Promise.all([getPlanificacionesSinValidar()]);

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
    <>
      {error.errorMessage || error.errorDetails ? (
        <Error
          errorMessage={error.errorMessage}
          errorDetails={error.errorDetails}
        />
      ) : loading ? (
        <Loading />
      ) : listaEmpresas.length > 0 ? (
        <>
          <ListaConBuscador
            columnas={columns}
            datosTabla={listaEmpresas}
            dirForward="/validarPlanificacion/empresa/"
            mensajeSearch="Buscar Empresa"
            nombreContador="Empresas"
          />
        </>
      ) : (
        <>
          <Typography>
            Actualmente no hay planificaciones sin validar
          </Typography>
        </>
      )}
    </>
  );
}

export default ListaEmpresasSinValidar;
