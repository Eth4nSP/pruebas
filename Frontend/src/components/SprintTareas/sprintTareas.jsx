import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';

function SprintTareas({ sprints, idDocente, idEmpresa }) {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Para controlar la paginación

    const handleVerTareas = (idSprint) => {
        navigate(`/grupoDocente/calificarTareasEmpresas/empresas/sprints/${idSprint}/${idDocente}/${idEmpresa}/semanas`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Fragment>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="sprints table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">HITO</TableCell> {/* Columna HITO */}
                            <TableCell align="left">Fecha Inicio</TableCell>
                            <TableCell align="left">Fecha Fin</TableCell>
                            <TableCell align="left">Cobro</TableCell>
                            <TableCell align="left">Fecha de Entrega</TableCell>
                            <TableCell align="left">Entregables</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sprints
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginar resultados
                            .map((sprint, index) => (
                                <TableRow
                                    key={sprint.idSprint}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                        },
                                        cursor: 'pointer',
                                    }}
                                >
                                    <TableCell align="left">{`SPRINT ${page * rowsPerPage + index + 1}`}</TableCell> {/* Mostrar número del Sprint */}
                                    <TableCell align="left">{sprint.fechaIni}</TableCell>
                                    <TableCell align="left">{sprint.fechaFin}</TableCell>
                                    <TableCell align="left">{sprint.cobro}</TableCell>
                                    <TableCell align="left">{sprint.fechaEntrega}</TableCell>
                                    <TableCell align="left">{sprint.entregables}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleVerTareas(sprint.idSprint)}
                                        >
                                            Ver Tareas
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={sprints.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Elementos por página"
                />
            </TableContainer>
        </Fragment>
    );
}

export default SprintTareas;
