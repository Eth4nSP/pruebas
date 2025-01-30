/* eslint-disable react/prop-types */
import { Fragment } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function Comentario({ comentario, linkDir, tituloComentario = 'Descripcion de la tarea:' }) {
  return (
    <Fragment>
      <div style={{display: 'block'}}>
        <div>
          <h3 style={{marginBottom : '0.7vw'}}>{tituloComentario}</h3>
          <p className='descripcion_inputText ' 
            readOnly 
          >
            {comentario ?
              comentario
              :
              'Sin Comentario'
            }
          </p>
          <div style={{display: 'flex',marginTop : '3vw',marginBottom:'3vw',justifyContent: 'flex-end'}}>
            {linkDir === 'ocultar' ?
              <></>
              :
              <Link to={linkDir}>
                <Button variant='contained'>ANADIR COMENTARIO</Button>
              </Link>  
            }
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Comentario;
