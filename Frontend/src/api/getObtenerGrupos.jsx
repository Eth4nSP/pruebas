const apiHost = import.meta.env.VITE_HOST;
export const getTodosLosGrupos = async () => {
    try {
      const response = await fetch(`${apiHost}/grupos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
  
      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else if (response.status === 404) {
        console.log('No se encontraron grupos.');
        return null;
      } else {
        throw new Error(`Error inesperado, código de estado: ${response.status}`);
      }
  
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  };
  