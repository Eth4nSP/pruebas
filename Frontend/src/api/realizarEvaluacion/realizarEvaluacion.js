// definir la url inicial de la api
const apiHost = import.meta.env.VITE_HOST;

/**
 * modifica los datos para configurar una evaluacion final
 * @returns {Promise<Object>} Las planificaciones con su ID
 */
export async function getDatosParaEvaluar(idEstudiante) {
    try {
        const response = await fetch(`${apiHost}/getDatosParaEvaluar/${idEstudiante}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });


        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener datos de la evaluacion:", error);
        return {
            error: true,
            message: error.message || "Ocurrió un error inesperado",
        };
    }

}

export async function evaluar(datosEvaluar) {
    try {
        const response = await fetch(`${apiHost}/evaluar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosEvaluar),
            credentials: "include",
        });


        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error al obtener datos de la evaluacion:", error);
        return {
            error: true,
            message: error.message || "Ocurrió un error inesperado",
        };
    }

}