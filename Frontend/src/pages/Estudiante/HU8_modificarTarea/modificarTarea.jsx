
import { Fragment, useEffect, useState } from 'react';
import { styled } from '@mui/material';
import BaseUI from '../../../components/baseUI/baseUI.jsx';
import { getTareaData, updateTarea } from '../../../api/validarTareas/tareas.jsx';
import DecisionButtons from '../../../components/Buttons/decisionButtons.jsx'
import CuadroDialogo from '../../../components/cuadroDialogo/cuadroDialogo.jsx';
import InfoSnackbar from '../../../components/infoSnackbar/infoSnackbar.jsx'

import { Box, FormControl, Button, TextField, IconButton, Modal} from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelSharp';;


function ModificarTarea() {
  const idTarea = localStorage.getItem("idTarea")
  const [responsables, setResponsables] = useState([]);
  const [responsablesError, setResponsablesError] = useState(false);
  const [descripcion, setDescripcion] = useState('Descripcion...');
  const [descripcionError, setDescripcionError] = useState(false);
  const [listaEstu, setListaEstu] = useState([{}])
  const [titulo, setTitulo] = useState('');

  const [deletedResponsables, setDeletedResponsables] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorDetails: "",
  }); 
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    autoHide: 6000,
  });
  const [cuadroDialogo, setCuadroDialogo] = useState({
    open: false,
    onConfirm: () => {},
    title: "",
    description: "",
  });
  const idEmpresa = localStorage.getItem('idEmpresa')
  useEffect(() => {
    const fetchTareaData = async () => {
      try {
        const data = await getTareaData(idTarea, idEmpresa)
        setTitulo(data.nombreTarea)
        setDescripcion(data.textoTarea);
        setResponsables(data.estudiantes);
        console.log(data)
        console.log(data)
        await filtrarEstuLista(data, data);
        
      } catch (error) {
        setError({
          error: true,
          errorMessage: "Ha ocurrido un error",
          errorDetails: error.message,
        });
        console.error("Error al cargar la tarea:", error);
      }finally {
        setLoading(false);
      }
      
    };
    fetchTareaData();
  }, [idTarea]);
  
  const filtrarEstuLista =(empresaData, data)=>{
    const filteredEstudiantes = empresaData.integrantes.filter((integrante) =>
      !data.estudiantes.some(
        (responsable) => integrante.idEstudiante === responsable.idEstudiante
      )
    );
    setListaEstu(filteredEstudiantes);
  }
  const handleCloseModal = ()=>{
    setModalVisible(false)
  }
  const agregarResponsable =(index)=>{
      const estuElegido = listaEstu[index];
      const newResponsables = [...responsables, estuElegido]
      setResponsables(newResponsables);      
      const newListaEstu = listaEstu.filter((_, i) => i !== index);
      setListaEstu(newListaEstu);
      setResponsablesError(newResponsables.length === 0);
      if(newListaEstu.length === 0){
        setModalVisible(false);
      }
  }
  const handleDeleteResponsable = (index) => {
    setListaEstu([...listaEstu, responsables[index]])
    const newResponsables = (responsables.filter((_, i) => i !== index));
    setResponsables(newResponsables);
    setDeletedResponsables([...deletedResponsables, responsables[index].idEstudiante])
    setResponsablesError(newResponsables.length === 0);
  };
  const handleChangeDescripcion = (e) =>{
    const value = e.target.value;
    setDescripcion(value);
    setDescripcionError(value.length < 20);
  }
  
  
  
  const handleCancel = () => {
    setCuadroDialogo({
      open: true,
      title: "Descartar los cambios",
      description:
        "Esta acción no se puede deshacer. Todos los cambios realizados se perderán.  ¿Está seguro?",
      onConfirm: () => window.location.reload(),
    });
  };
  const handleSave = () => {
    setCuadroDialogo({
      open: true,
      title: "Guardar los cambios",
      description:
        "Esta acción guardará todos los cambios realizados en la tarea. ¿Está seguro?",
      onConfirm: handleSubmit,  
    });
  };
  const handleSubmit = async (event) => {
    setCuadroDialogo({
      ...cuadroDialogo,
      open: false,
    });
    event.preventDefault();
    
    setDescripcionError(descripcion === '');
    setResponsablesError(responsables.length === 0);
    if(descripcion === '' || responsables.length === 0) return 

  
    try {
      const formData = {
        idTarea,
        responsables,
        descripcion,
      };
  
      const response = await updateTarea(idTarea, formData);
      if (response.ok) { 
        setSnackbar({
          open: true,
          message: "Se subió correctamente todo",
          severity: "success",
          autoHide: 6000,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      setSnackbar({
        open: true,
        message: `Hubo un error al momento de subir, error: ${error}`,
        severity: "error",
        autoHide: 60000,
      });
    }
  };
  
  return (
    <Fragment>
      <BaseUI
        titulo={'MODIFICAR TAREA'}
        ocultarAtras={false}
        confirmarAtras={true}
        dirBack={`/homeEstu/listaTareas`}
        loading={loading}
        error={error}
      >
        <ContainerdropZone>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <FormControl className="formControl">
              <h1>{titulo}</h1>
              <h3>Responsables:</h3>
              {responsables.map((responsable, index) => (
                responsable.nombreEstudiante !== undefined ? (
                  <div className='responsables' key={index}>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteResponsable(index)}
                    >
                      <CancelRoundedIcon />
                    </IconButton>
                    <p>{`${responsable.nombreEstudiante} ${responsable.primerApellido} ${responsable.segundoApellido}`}</p>
                    
                  </div>    
                ) : null
              ))}
              {responsablesError? <helperText style={{ color: 'red' }}>Debe haber un responsable minimo</helperText>:<></>}
              {listaEstu.length === 0?
                <></>
                :                
                <Button variant='contained' sx={{width:'calc(8vw + 8rem)'}} onClick={()=>setModalVisible(true)} className='titulo'>
                  + Añadir Responsables
                </Button>
              }
              <h3 className='tituloH3'>Descripcion de la Tarea:</h3>
              <div className="form_inputText">
                <StyledTextField
                  value={descripcion}
                  error={descripcionError}
                  onChange={(e) => handleChangeDescripcion(e)}
                  required
                  variant="outlined"
                  placeholder="Escribe una descripcion para la tarea..."
                  multiline
                  inputProps={{ maxLength: 500 }}
                  helperText = {descripcionError? 'Debe ingresar una descripción de la tarea, min 20 caracteres':<></>}
                />
              </div>
              <div className="form_buttons">
               <DecisionButtons
                  rejectButtonText="Descartar"
                  validateButtonText="Guardar cambios"
                  onReject={handleCancel}
                  onValidate={handleSave}
                  disabledButton={0}
                />
              </div>
            </FormControl>
          </form>
          <CuadroDialogo
            open={cuadroDialogo.open}
            onClose={() => setCuadroDialogo({ ...cuadroDialogo, open: false })}
            title={cuadroDialogo.title}
            description={cuadroDialogo.description}
            onConfirm={cuadroDialogo.onConfirm}
          />
          <InfoSnackbar
            openSnackbar={snackbar.open}
            setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
            message={snackbar.message}
            severity={snackbar.severity}
            autoHide={snackbar.autoHide}
          />          

          <Modal
            open={modalVisible}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={style}
            >
              <IconButton
                  color="secondary"
                  onClick={handleCloseModal}
                  style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                  }}
              >
                  <CancelRoundedIcon />
              </IconButton>
              {listaEstu.map((estu, index)=>(
                <Button color='inherent' key={index} fullWidth 
                sx={{
                  justifyContent: 'flex-start',
                  width: '100%',
                  borderBottom: '1px solid #B0B0B0',
                  borderRadius: 0,
                  padding:'1rem'
                }}
                onClick={ () => agregarResponsable(index)}
                >{estu.nombreEstudiante+' '+estu.primerApellido+' '+estu.segundoApellido}</Button>
              ))}
            </Box>
          </Modal>
        </ContainerdropZone>
      </BaseUI>
    </Fragment>
  );
}

export default ModificarTarea;
const ContainerdropZone = styled('div')`
  margin-top: 1rem;
  margin-bottom: 1rem;
  .responsables{
    display: flex;
    align-items: center;
  }
  .responsables p{
    margin-left: 0.3rem;
  }
  .tituloH3 {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  form {
    height: 100%;
  }
  .form_buttons {
    display: flex;
    justify-content: end;
  }
  .buttons {
    margin-left: 1rem;
  }
  .formControl {
    height: 100%;
    width: 100%;
  }
`;
const StyledTextField = styled(TextField)`
  width: 100%;
  padding-bottom: 1rem;
  .MuiOutlinedInput-root {
    .MuiInputBase-input {
      height: auto;
      min-height: 30vh;
      padding: 1rem;
    }
    & fieldset {
      border: 0.3rem solid #000000;
    }
  }
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '5px solid #A629C2',
  boxShadow: 24,
  p: 4,
};