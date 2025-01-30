// definir la url inicial de la api
const apiHost = import.meta.env.VITE_HOST;

/**
 * Obtiene las planificaciones que no fueron publicadas
 * @returns {Promise<Object>} Las planificaciones con su ID
 */
export async function getPlanificacionesSinPublicar() {
    try {
        const response = await fetch(`${apiHost}/planificacionesSinPublicar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los datos del sprint');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error al obtener las planificaciones no publicadas:', error);
        throw error;
    }
}


/**
 * Obtiene las planificaciones que se pueden modificar
 * @returns {Promise<Object>} Las planificaciones con su ID
 */
export async function getPlanificacionesParaModificar() {
    try {
        const response = await fetch(`${apiHost}/planificacionesParaModificar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los datos del sprint');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error al obtener las planificaciones para modificar:', error);
        throw error;
    }
}

/**
 * Obtiene una lista de sprints para una empresa específica
 * @param {number} idEmpresa El ID de la empresa
 * @returns {Promise<Array>} Lista de sprints de la empresa
 */
export async function getListaSprintsPorIdEmpresa(idEmpresa) {
    try {
        const response = await fetch(`${apiHost}/getListaSprintsPorIdEmpresa?idEmpresa=${idEmpresa}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener la lista de sprints');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error en la API getListaSprintsPorIdEmpresa:', error);
        throw error;
    }
}