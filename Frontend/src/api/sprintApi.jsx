const apiHost = import.meta.env.VITE_HOST;
export const getSprintSemanas = async (idSprint) => {
  try {
    const response = await fetch(
      `${apiHost}/estudiante/sprint/semana/${idSprint}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener los datos del sprint");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const actualizarSprint = async (idSprint, comentario, nota) => {
  try {
    const response = await fetch(
      `${apiHost}/sprint/${idSprint}/actualizar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comentario,
          nota,
        }),
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el sprint");
    }

    const data = await response.json();
    return response.ok;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const aceptarEntregables = async (aceptados) => {
  try {
    const response = await fetch(
      `${apiHost}/aceptarEntregables`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entregables: aceptados
        }),
        credentials: 'include'
      }
    );
    if (!response.ok) {
      throw new Error("Error al actualizar el sprint");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const getSprintSemanasTareas = async (idEmpresa) => {
  try {
    const response = await fetch(
      `${apiHost}/empresa/${idEmpresa}/sprintsSemanasTareas`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error al obtener los datos de los sprints, semanas y tareas"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
