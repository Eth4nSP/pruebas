/* eslint-disable react/prop-types */
import { Fragment } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CuadroDialogo from '../cuadroDialogo/cuadroDialogo';


function ButtonBackAndTitle({titulo, ocultarAtras, confirmarAtras, dirBack}) {
    const navigate = useNavigate();
    const [openConfirmarDialog, setOpenConfirmarDialog] = useState(false);

    function goBack() {
        if (confirmarAtras) {
            handleConfirmar();
        } else {
            navigate(dirBack);
        }
    }

    const handleConfirmar = () => {
        setOpenConfirmarDialog(true);
    };

    const handleConfirmarAtras = () => {
        navigate(dirBack);
    };

    return (
        <Fragment>
            {!ocultarAtras && (
                <Button variant="contained" onClick={goBack}>
                    Atras
                </Button>
            )}
            <h1>{titulo}</h1>
            <CuadroDialogo
                open={openConfirmarDialog} 
                onClose={() => setOpenConfirmarDialog(false)}
                onConfirm={handleConfirmarAtras}
                title={'Al volver atrás, se desharán los cambios'}
                description={'Esta acción no se puede deshacer. Todos los cambios realizados se perderán. ¿Esta Seguro?'}
            />
        </Fragment>
    );
}

export default ButtonBackAndTitle;
