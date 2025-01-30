import BaseUI from "../../../../components/baseUI/baseUI";
import ListaEmpresasVisualizar from "../../../../components/listas/listaEmpresasVisualizar";
function SeleccionarEmpresaVisualizar() {
  return (
    <BaseUI
      titulo={"SELECCIONE UNA PLANIFICACION PARA VISUALIZAR"}
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={"/homeDocente"}
      loading={false}
      error={{error:false}}
    >
      <ListaEmpresasVisualizar />
    </BaseUI>
  );
}

export default SeleccionarEmpresaVisualizar;

