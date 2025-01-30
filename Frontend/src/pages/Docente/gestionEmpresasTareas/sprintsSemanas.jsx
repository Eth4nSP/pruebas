import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BaseUI from '../../../components/baseUI/baseUI';
import SprintSemanas from '../../../components/SprintTareas/sprintSemanas';
import { getSprintSemanasTareas } from '../../../api/getSprintSemanasTareas';

function SprintsSemanas() {
    const { idSprint, idDocente, idEmpresa } = useParams();
    const [sprintData, setSprintData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSprintData = async () => {
            try {
                const data = await getSprintSemanasTareas(idSprint);
                setSprintData(data);
            } catch (err) {
                console.error('Error en la solicitud:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSprintData();
    }, [idSprint]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleTareaClick = (idTarea) => {
        navigate(`/grupoDocente/calificarTareasEmpresas/empresas/sprints/semanas/tareas/${idTarea}/${idSprint}/${idEmpresa}/${idDocente}/tarea`);
    };

    return (
        <Fragment>
            <BaseUI
                titulo={`CALIFICAR SPRINT ${idSprint}`}
                ocultarAtras={false}
                confirmarAtras={false}
                dirBack={`/grupoDocente/calificarTareasEmpresas/empresas/${idEmpresa}/${idDocente}/sprints`}
                loading={loading}
                error={error}
            >

                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <h1 style={{ position: 'absolute', top: 0, left: 0, margin: '10px' }}>
                        Sprint {idSprint}
                    </h1>
                </div>

                {/* Separar las semanas en una nueva línea */}
                <div className='sprint-semanas-container' style={{ marginTop: '60px' }}>
                    {sprintData.semanas && sprintData.semanas.length > 0 ? (
                        sprintData.semanas.map((semana) => (
                            <SprintSemanas key={semana.idSemana} title={`Semana ${semana.idSemana}`}>
                                {semana.tareas.map((tarea, index) => (
                                    <div key={tarea.idTarea} className="collapse-child" onClick={() => handleTareaClick(tarea.idTarea)}>
                                        Tarea {index + 1}: {tarea.textoTarea}
                                    </div>
                                ))}
                            </SprintSemanas>
                        ))
                    ) : (
                        <p>No hay semanas ni tareas para este sprint.</p>
                    )}
                </div>
            </BaseUI>
        </Fragment>
    );
}

export default SprintsSemanas;
