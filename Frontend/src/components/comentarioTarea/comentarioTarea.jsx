/* eslint-disable react/prop-types */
import { Fragment } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function ComentarioTarea({ comentario, linkDir }) {
  return (
    <Fragment>
      <div className='tareaDiv'>
      <div>
          <h3>Archivo</h3>
          <p className='descripcion_inputText' 
            readOnly 
          >
          </p>

          <h3>Descripcion de la tarea :</h3>
          <p className='calificar_inputText' 
            readOnly 
          >
            {comentario ?
              comentario
              :
              'Descripcion Tarea'
            }
          </p>
            {linkDir === 'ocultar' ?
              <></>
              :
              <Link to={linkDir}>
                <Button variant='contained'>Editar</Button>
              </Link>  
            }
          </div>
        </div>
    </Fragment>
  );
}

export default ComentarioTarea;
