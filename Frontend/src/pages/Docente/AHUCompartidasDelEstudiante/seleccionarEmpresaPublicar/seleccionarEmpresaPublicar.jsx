
import BaseUI from "../../../../components/baseUI/baseUI.jsx";
import ListaEmpresasPublicar from "../../../../components/listas/listaEmpresasPublicar.jsx";
function SeleccionarEmpresaPublicar() {
  return (
    <>
      <BaseUI
        titulo = {'SELECCIONE UNA PLANIFICACION PARA PUBLICAR'}
        ocultarAtras = {false}
        confirmarAtras = {false}
        dirBack = {'/'}
        loading={false}
        error={{error:false}}
      >
          <ListaEmpresasPublicar />
      </BaseUI>
    </>
  );
}

export default SeleccionarEmpresaPublicar;
