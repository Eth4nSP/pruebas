import { Fragment, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import InfoEmpresa from "../../../components/infoEmpresa/infoEmpresa.jsx";
import NombreEmpresa from "../../../components/infoEmpresa/nombreEmpresa.jsx";
import TablaPlanificacion from "../../../components/tablaPlanificacionDeDesarollo/tablaPlanificacion.jsx";
import { getEmpresaData } from "../../../api/getEmpresa.jsx";
import { getPlanificacion } from "../../../api/getPlanificacion.jsx";
import BaseUI from "../../../components/baseUI/baseUI.jsx";
import cookie from "js-cookie";
import { decrypt } from "../../../api/decrypt.jsx";
function PlanificacionDeDesarollo() {
  const random = cookie.get('random');
  const role = decrypt(random);
  const [empresaData, setEmpresaData] = useState(null);
  let { idEmpresa } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    errorMessage: "",
    errorDetails: "",
  });
  const [planificacionData, setPlanificacionData] = useState({
    aceptada: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empresa, planificacion] = await Promise.all([
          getEmpresaData(idEmpresa),
          getPlanificacion(idEmpresa),
        ]);
        setEmpresaData(empresa);
        setPlanificacionData(planificacion);
        console.log(planificacion)
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
        setError({
          errorMessage: "Ha ocurrido un error",
          errorDetails: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idEmpresa]);
  return (
    <Fragment>
      <BaseUI
        titulo={"VISUALIZAR PLANIFICACION"}
        ocultarAtras={false}
        confirmarAtras={false}
        dirBack={role === "docente" ? "/visualizarPlanificacion" : "/homeEstu"}
        loading={loading}
        error={error}
      >
          <>
            {!planificacionData.aceptada ? (
              <>
                <NombreEmpresa
                  nombreLargo={empresaData?.nombreLargo}
                  nombreCorto={empresaData?.nombreEmpresa}
                />
                <div className="divContainerPlani">
                  <h1>TODAVIA NO FUE VALIDADA</h1>
                </div>
              </>
            ) : (
              <>
                <InfoEmpresa
                  nombreLargo={empresaData?.nombreLargo}
                  nombreCorto={empresaData?.nombreEmpresa}
                  integrantes={empresaData?.integrantes}
                />
                <TablaPlanificacion
                  sprints={planificacionData?.sprints}
                  ocultarBotones={true}
                />
                {/** 
                {planificacionData.comentariopublico && (
                  <Comentario
                    titulo="Comentario:"
                    comentario={planificacionData.comentariopublico}
                  />
                )}
                {(planificacionData.comentarioprivado && loginDocente) && (
                  <Comentario
                    titulo="Comentario Privado:"
                    comentario={planificacionData.comentarioprivado}
                  />
                )}
                  \*/}
              </>
            )}
          </>
      </BaseUI>
    </Fragment>
  );
}

export default PlanificacionDeDesarollo;
