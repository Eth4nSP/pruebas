import { useState, useEffect } from 'react';
import { styled } from '@mui/material';
import { Button, TextField, Alert, AlertTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getTareaData, calificarTarea } from '../../api/validarTareas/tareas';
import PopUpDialog from '../popUPDialog/popUpDialog';

const CalificarTarea = ({ idTarea }) => {
  const [tarea, setTarea] = useState(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTareaData = async () => {
      try {
        const data = await getTareaData(idTarea);
        setTarea(data);
        setNota(data.notatarea);
        setComentario(data.comentario);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar la tarea:', error);
        setLoading(false);
      }
    };

    fetchTareaData();
  }, [idTarea]);

  const handleGuardar = async () => {
    try {
      await calificarTarea(idTarea, nota, comentario);
      setAlertInfo({ type: 'success', message: 'Calificación guardada correctamente.' });
    } catch (error) {
      console.error('Error al guardar la calificación', error);
      setAlertInfo({ type: 'error', message: 'Hubo un error al guardar la calificación.' });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleValidarCampos = () => {
    if (!nota || !comentario) {
      setAlertInfo({ type: 'warning', message: 'Ninguno de los campos debe estar vacío' });
    } else {
      setOpenDialog(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo(null);
  };

  const handleCancel = () => {
    setOpenCancelDialog(true);
  };

  // Validación de nota para que sea solo un número entre 0 y 100 y controle los ceros iniciales
  const handleNotaChange = (e) => {
    let value = e.target.value;

    // Remover cualquier carácter que no sea un número
    let formattedValue = value.replace(/[^0-9]/g, '');

    // Eliminar ceros iniciales no deseados
    if (formattedValue.length > 1 && formattedValue.startsWith('0')) {
      formattedValue = formattedValue.replace(/^0+/, '');
    }

    // Asegurar que el valor esté entre 0 y 100
    if (formattedValue === '' || (formattedValue.length <= 3 && Number(formattedValue) <= 100)) {
      setNota(formattedValue);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!tarea) {
    return <div>No hay datos disponibles para esta tarea.</div>;
  }

  return (
    <>
      <h1>MockUps</h1>
      <ArchivosYEstudiantesSection>
        <ArchivosSection>
          <h3>Archivos:</h3>
          <ArchivosWrapper>
            <div className="archivos-icons">
              {tarea.archivotarea && tarea.archivotarea.length > 0 ? (
                tarea.archivotarea.map((archivo) => (
                  <a key={archivo.idArchivo} href={archivo.archivo} download>
                    <img src="/icono-archivo.png" alt="Archivo" />
                  </a>
                ))
              ) : (
                <>
                  <img src="/icono-pdf.png" alt="PDF" className="archivo-ejemplo" />
                  <img src="/icono-img.png" alt="Imagen" className="archivo-ejemplo" />
                  <img src="/icono-rar.png" alt="RAR" className="archivo-ejemplo" />
                </>
              )}
            </div>
          </ArchivosWrapper>
        </ArchivosSection>

        <EstudiantesSection>
          <h3>Estudiantes:</h3>
          <div className="fotos-estudiantes">
            {tarea.estudiantes && tarea.estudiantes.length > 0 ? (
              tarea.estudiantes.map((estudiante) => (
                <EstudianteFoto key={estudiante.id} src={estudiante.foto || '/icono-usuario.png'} alt={`Foto de ${estudiante.nombre}`} />
              ))
            ) : (
              <>
                <EstudianteFoto src="/icono-usuario.png" alt="Usuario" />
                <EstudianteFoto src="/icono-usuario.png" alt="Usuario" />
              </>
            )}
          </div>
        </EstudiantesSection>
      </ArchivosYEstudiantesSection>

      <DescripcionTarea>
        <h3>Descripción de la tarea:</h3>
        <p>{tarea.textotarea}</p>
      </DescripcionTarea>

      <ComentarioDocente>
        <h3>Comentario Docente:</h3>
        <StyledTextField
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentarios del docente"
          multiline
          minRows={6}
          style={{ minHeight: '150px' }}
        />
      </ComentarioDocente>

      <NotaYBotonesSection>
        <NotaSection>
          <h3>NOTA:</h3>
          <StyledTextField
            type="text" // Cambiado a texto para mayor control
            value={nota}
            onChange={handleNotaChange}
            placeholder="Escribe la nota..."
            inputProps={{ maxLength: 3 }} // Limitar el número de caracteres
            style={{ width: '80px' }}
          />
        </NotaSection>
        <BotonesSection>
          <Button variant="contained" color="secondary" className="btn-cancelar" onClick={handleCancel}>
            No Guardar
          </Button>
          <Button variant="contained" color="primary" onClick={handleValidarCampos}>
            Guardar
          </Button>
        </BotonesSection>
      </NotaYBotonesSection>

      {/* Componente de PopUpDialog */}
      <PopUpDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        titleDialog="Confirmación"
        textDialog="¿Estás seguro de guardar la calificación?"
        especial={handleGuardar}
      />
      <PopUpDialog
        openDialog={openCancelDialog}
        setOpenDialog={setOpenCancelDialog}
        especial={() => window.location.reload()}
        titleDialog={'¿Estás seguro de que quieres descartar los cambios?'}
        textDialog={'Esta acción no se puede deshacer. Todos los cambios realizados se perderán.'}
      ></PopUpDialog>
      {/* Mensaje de Alerta */}
      {alertInfo && (
        <Alert severity={alertInfo.type} onClose={handleCloseAlert}>
          <AlertTitle>{alertInfo.type === 'success' ? 'Éxito' : 'Error'}</AlertTitle>
          {alertInfo.message}
        </Alert>
      )}
    </>
  );
};

export default CalificarTarea;

const ArchivosYEstudiantesSection = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ArchivosSection = styled('div')`
  margin-top: 1rem;
`;

const ArchivosWrapper = styled('div')`
  padding: 1rem;
  .archivos-icons {
    display: flex;
    gap: 1rem;
  }
  .archivo-ejemplo {
    width: 50px;
    height: 50px;
  }
`;

const EstudiantesSection = styled('div')`
  margin-top: 1rem;
  .fotos-estudiantes {
    display: flex;
    gap: 1rem;
  }
`;

const EstudianteFoto = styled('img')`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const DescripcionTarea = styled('div')`
  margin-top: 1rem;
`;

const NotaYBotonesSection = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const NotaSection = styled('div')`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BotonesSection = styled('div')`
  display: flex;
  gap: 1rem;
`;

const ComentarioDocente = styled('div')`
  margin-top: 1rem;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-top: 1rem;
  .MuiOutlinedInput-root {
    & fieldset {
      border: 0.3rem solid #000000;
    }
    &:hover fieldset {
      border-color: #999;
    }
    &.Mui-focused fieldset {
      border-color: blue;
    }
  }
`;
