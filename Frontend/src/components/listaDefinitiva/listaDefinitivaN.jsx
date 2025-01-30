/* eslint-disable react/prop-types */
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import BaseUI from '../baseUI/baseUI';
import NombreEmpresa from '../infoEmpresa/nombreEmpresa';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';  
import {TextField} from '@mui/material';
import { useEffect, useState } from 'react';
function ListaDefinitivaN({ 
    titulo, 
    cabezeraTitulo, 
    cabezeras, 
    datosTabla, 
    ocultarAtras, 
    confirmarAtras, 
    dirBack, 
    dirForward,
    mensajeSearch,
    nombreContador,
    loading,
    error
}) {
    
    const paginationModel = { page: 0, pageSize: 10 };
    const navigate = useNavigate();

    const handleRowClick = (id) => {
        localStorage.setItem('idEmpresa',id)
        if (dirForward) {
            navigate(`${dirForward}`);
        }
    }
    const [searchValue, setSearchValue] = useState('');
    const [notFound, setNotFound] = useState('');


    const filtered = (datosTabla || []).filter((data) => {
        const nombreCompleto = `${data.nombreEstudiante || ''} ${data.apellidoPaternoEstudiante || ''} ${data.apellidoMaternoEstudiante || ''}`.toLowerCase();
        const nombreEmpresa = (data.nombreEmpresa || '').toLowerCase();
        return (
            nombreCompleto.includes(searchValue.toLowerCase()) || 
            nombreEmpresa.includes(searchValue.toLowerCase()) ||
            (data.totalEstudiantes ? data.totalEstudiantes.toString().includes(searchValue) : false)
        );
    });

    useEffect(() => {
        if ((filtered || []).length === 0) {
            setNotFound(searchValue.trim() === '' ? '' : 'No se encontraron resultados que coincidan con la búsqueda');
        } else {
            setNotFound('');
        }
    }, [searchValue, filtered.length]);
    


    return (
        <BaseUI        
            titulo={titulo}
            ocultarAtras={ocultarAtras}
            confirmarAtras={confirmarAtras}
            dirBack={dirBack}
            loading={loading}
            error={error}
        >
            {cabezeraTitulo&&
                <NombreEmpresa nombreCorto={cabezeraTitulo.nombreCorto} nombreLargo={cabezeraTitulo.nombreLargo} />
            }
            
            <Container>
                <div className='search'>
                    <div className='search_input'>
                        <Autocomplete
                            freeSolo
                            disablePortal
                            disableListWrap
                            options={[]}
                            inputValue={searchValue} 
                            onInputChange={(event, newValue) => setSearchValue(newValue)} 
                            sx={{ width: 'calc(10vw + 6rem)' }}
                            renderInput={(params) => <TextField {...params} label={mensajeSearch} />}
                        />
                        <SearchIcon  className='search_icon'/>
                    </div>
                    <div className='search_input'>
                        <h2 className='search_input--h2'>{nombreContador?datosTabla?.length+" "+nombreContador : ""}</h2>
                    </div>
                </div>
                <TableContainer component={Paper}>
                <DataGrid
                    rows={filtered}
                    columns={cabezeras}
                    getRowId={(row) => row.id} //todos deben tener un id llamado id 
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[10, 20]}
                    disableColumnMenu
                    hideFooterSelectedRowCount
                    hideFooterPagination = {notFound || filtered.length < paginationModel.pageSize}
                    onRowClick={(params) => handleRowClick(params.id)}
                    sortingOrder={['asc', 'desc']} 
                    disableColumnResize
                    sx={{
                        '& .MuiDataGrid-row': {
                            cursor: dirForward ? 'pointer' : 'default',
                        },'& .MuiDataGrid-cell:focus': {
                            outline: dirForward ? 'none' : 'default',
                        },
                    }}
                />
                </TableContainer>
                <div className='alerta'>
                    <h3> {notFound? notFound : ""} </h3>
                </div>
            </Container>
        </BaseUI>
    );
}

export default ListaDefinitivaN;

const Container = styled('div')`
    .tableRow {
        padding-top: 2rem;
        padding-bottom: 2rem;
        font-weight: bold;
        white-space: nowrap;
    }
    .tableRow--body {
        cursor: default;
        transition: background-color 0.3s;
        &:hover {
            background-color: #e0e0e0;
        }
    }
    .tableRow--body.clickable {
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover {
            background-color: #e0e0e0;
        }
    }
    .tableCell { 
        white-space: nowrap;
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
    .red{
        color: red;
    }
    .search{
        display: flex;
        align-content: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }
    .search_input{
        display: flex;
        align-items: center;
    }
    .search_icon{
        color: grey;
        margin-left: 1rem;
    }
    .alerta{
        display: flex;
        justify-content: center;
        color: red;
    }
    .search_input--h2{
        font-size: calc(1vw + 0.8rem);
    }
`;
