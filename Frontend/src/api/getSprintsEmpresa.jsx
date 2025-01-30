const apiHost = import.meta.env.VITE_HOST;
export const getSprintsEmpresa = async (idEmpresa, idDocente) => {
    try {
        const response = await fetch(`${apiHost}/empresa/${idEmpresa}/${idDocente}/sprints`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de la empresa');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};




export const getSprintEstudiantes = async (idEmpresa, idSprint) => {
    try {
        const response = await fetch(`${apiHost}/empresa/${idEmpresa}/sprint/${idSprint}/tareas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del sprint');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};

export const updateSprintEvaluar = async (idEmpresa, idSprint, estudiantes) => {
    try {
        const response = await fetch(`${apiHost}/empresa/${idEmpresa}/sprint/${idSprint}/evaluacion`, {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ estudiantes }),
            
           
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la evaluación');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};
