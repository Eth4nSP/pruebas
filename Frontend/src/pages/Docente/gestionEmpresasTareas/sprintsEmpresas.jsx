import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSprintsEmpresa } from '../../../api/getSprintsEmpresa';
import SprintTareas from '../../../components/SprintTareas/sprintTareas';
import BaseUI from '../../../components/baseUI/baseUI';
import NombreEmpresa from '../../../components/infoEmpresa/nombreEmpresa';

function SprintsEmpresas() {
    let { idEmpresa, idDocente } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sprintsData, setSprintsData] = useState([]);
    const [nombreEmpresa, setNombreEmpresa] = useState();
    const [nombreLargo, setNombreLargo] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const empresaData = await getSprintsEmpresa(idEmpresa, idDocente);
                setSprintsData(empresaData.sprints);
                setNombreEmpresa(empresaData.nombre);
                setNombreLargo(empresaData.nombreLargo);
            } catch (error) {
                console.error('Error en la solicitud:', error.message);
                setError(`Error en la solicitud: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    });

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Fragment>
            <BaseUI
                titulo={`CALIFICAR TAREAS SPRINTS `}
                ocultarAtras={false}
                confirmarAtras={false}
                dirBack={`/grupoDocente/calificarTareasEmpresas/` + idDocente + `/empresas`}
                loading={loading}
                error={{error:error}}
            >
                <NombreEmpresa nombreLargo={nombreLargo} nombreCorto={nombreEmpresa}></NombreEmpresa>

                {sprintsData.length > 0 ? (
                    <SprintTareas sprints={sprintsData} idDocente={idDocente} idEmpresa={idEmpresa} />
                ) : (
                    <h3>No hay sprints disponibles para esta empresa.</h3>
                )}
            </BaseUI>
        </Fragment>
    );
}

export default SprintsEmpresas;
