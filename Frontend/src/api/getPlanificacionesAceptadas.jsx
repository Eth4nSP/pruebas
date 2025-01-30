const apiHost = import.meta.env.VITE_HOST;
export const getPlanificacionesAceptadas   = async () => {
  
    try {
      const response = await fetch(`${apiHost}/planificacionAceptadas`, {
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
  