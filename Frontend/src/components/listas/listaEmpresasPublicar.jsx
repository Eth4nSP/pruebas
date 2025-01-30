import { Fragment, useMemo, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getPlanificacionesSinPublicar } from "../../api/listas/listasEmpresas";
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

function ListaEmpresasPublicar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    errorMessage: "",
    errorDetails: "",
  });
  const [listaEmpresas, setListaEmpresas] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await Promise.all([getPlanificacionesSinPublicar()]);
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
            dirForward="/publicarPlanificacion/empresa/"
            mensajeSearch="Buscar Empresa"
            nombreContador="Empresas"
          />
        </>
      ) : (
        <>
          <Typography>
            Actualmente no hay planificaciones sin publicar
          </Typography>
        </>
      )}
    </>
  );
}

export default ListaEmpresasPublicar;
