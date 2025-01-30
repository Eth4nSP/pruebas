/* eslint-disable react/prop-types */
import { Fragment} from 'react';
import  { 
            Dialog,
            DialogTitle,
            DialogContent,
            DialogContentText,
            DialogActions,
            Button 
        } from '@mui/material';
function PopUpDialog({openDialog, setOpenDialog, especial, titleDialog, textDialog}) {
    const handleConfirm = () => {
        if(especial() != undefined ){
            especial()
        }
        setOpenDialog(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        
    };

  return (
    <Fragment>
        <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="save-dialog-title"
        aria-describedby="save-dialog-description"
        >
            <DialogTitle id="save-dialog-title">
                {titleDialog}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="save-dialog-description">
                    {textDialog}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} variant='contained' color='secondary'>Cancelar</Button>
                <Button onClick={handleConfirm} autoFocus variant='contained'>
                Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    </Fragment>
  );
}

export default PopUpDialog;