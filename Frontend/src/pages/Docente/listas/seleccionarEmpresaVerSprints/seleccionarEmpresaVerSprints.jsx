import BaseUI from "../../../../components/baseUI/baseUI";
import ListaEmpresasVerSprints from "../../../../components/listas/listaEmpresasVerSprints";
function SeleccionarEmpresaVerSprints() {
  return (
    <BaseUI
      titulo={"SELECCIONE UNA EMPRESA PARA VISUALIZAR SUS SPRINTS"}
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={"/homeDocente"}
      loading={false}
      error={{error:false}}
    >
      <ListaEmpresasVerSprints />
    </BaseUI>
  );
}

export default SeleccionarEmpresaVerSprints;
