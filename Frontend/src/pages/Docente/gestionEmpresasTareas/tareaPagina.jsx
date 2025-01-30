//////ELIMINAR NO SE UTILIZA EN NINGUN LADO
import CalificarTarea from '../../../components/CalificarTarea/CalificarTarea';
import { useParams } from 'react-router-dom';
import BaseUI from '../../../components/baseUI/baseUI';

const TareaPage = () => {
  const { idTarea, idSprint, idDocente, idEmpresa } = useParams();

  return (
    <BaseUI
      titulo={'CALIFICAR TAREA'}
      ocultarAtras={false}
      confirmarAtras={true}
      dirBack={`/grupoDocente/calificarTareasEmpresas/empresas/sprints/` + idSprint + `/` + idEmpresa + `/` + idDocente + `/semanas`}
      loading={false}
      error={{error:false}}
    >
      <CalificarTarea idTarea={idTarea} /> {/* Pasar idTarea a CalificarTarea */}
    </BaseUI>
  );
};

export default TareaPage;
