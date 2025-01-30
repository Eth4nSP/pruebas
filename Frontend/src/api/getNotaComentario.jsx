const apiHost = import.meta.env.VITE_HOST;
export const getNotaComentario = async (idPlanificacion) => {
  
    try {
      const response = await fetch(`${apiHost}/planificacion/notaComentario/${idPlanificacion}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los datos de la planificacion');
      }
  
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
};
  