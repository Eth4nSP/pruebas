import { Fragment,useEffect,useState } from 'react';
import { styled } from '@mui/material';
import BaseUI from '../../../components/baseUI/baseUI';
import {getTareaData} from "../../../api/validarTareas/tareas";// Ícono para archivos de texto

function VisualizarTarea() {
    const [descripcion, setDescripcion] = useState("");
    const [responsables, setResponsables] = useState([]);
    const [nombreTarea,setNombreTarea] = useState([]);
    const idTarea = localStorage.getItem("idTarea")
    const idEstudiante = localStorage.getItem("idEstudiante")
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({
      error: false,
      errorMessage: "",
      errorDetails: "",
  });
    useEffect(() => {
      const fetchTareaData = async () => {
        try {
          const data = await getTareaData(idTarea);
          setDescripcion(data.textoTarea);
          setResponsables(data.estudiantes);
          setNombreTarea(data.nombreTarea);
          setLoading(false);
        } catch (error) {
          console.error("Error al cargar la tarea:", error);
          setError(
            {
              error: true,
              errorMessage: "",
              errorDetails: ""
            }
          )
        }
      };
  
      fetchTareaData();
    }, [idTarea]);
  

    return (
        <Fragment>
          <BaseUI
            titulo = {'VISUALIZAR TAREA'}
            ocultarAtras = {false}
            confirmarAtras = {false}
            dirBack = {idEstudiante===null?`/homeDocente/listaEmpresasVerTareas/sprints`:`/homeEstu/listaSprintsSemanasTareas`}
            loading={loading}
            error={error}
          >
            <div>
              <div><h1>{nombreTarea}</h1></div>
              <DescripcionTarea>
                <h4>Responsables</h4>
                <Responsables>
                  {responsables.length > 0 ? (
                    responsables.map((responsable, index) => (
                      <p key={index}>
                        {responsable.nombreEstudiante} {responsable.primerApellido} {responsable.segundoApellido}
                      </p>
                    ))
                  ) : (
                    <p>No hay responsables asignados</p>
                  )}
                </Responsables>
              </DescripcionTarea>
            </div>
            <h3>Descripcion de la tarea</h3>
            <Rectangulo>{descripcion}</Rectangulo>
          </BaseUI> 
        </Fragment>
    );
}

export default VisualizarTarea;

const DescripcionTarea = styled('div')`
  margin-top: 1rem;
`;

const Responsables = styled('div')`
    box-sizing: border-box;
    width: 50%;
    padding: 1vw;
    min-height: 20px;
    width: 40;
    padding-bottom: 10px;
`;

const Rectangulo = styled('div')`
    box-sizing: border-box;
    width: 100%;        
    padding: 2.5vw;     
    min-height: 200px;  
    padding-bottom: 20px; 
    border: 4px solid #000000;  
    margin: 20px auto;
`;