/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled'
function TablaPlanificacionNotas( {numeroDeFaltas, sprints, notaProductoFinal} ) {
  function createData(titulo, nota) {
    return { titulo, nota};
  }
  const [sumatoriaSprints, setSumatoriaSprints] = useState(0);
  useEffect(()=>{

    if(sprints != null){
      const tam = sprints.length;
      setSumatoriaSprints (Math.round(sprints.reduce((acumulador,sprint)=> acumulador+sprint.notasprint, 0)/tam))
    }
  },[sprints])
  const rows = [
    createData('FALTAS DEL GRUPO', numeroDeFaltas),
    createData('NOTA SUMATORIA SPRINTS', sumatoriaSprints?sumatoriaSprints:'Sin Calificar'),
    createData('NOTA PRODUCTO TERMINADO', notaProductoFinal? notaProductoFinal: 'Sin Calificar'),
  ];
  return (
    <Fragment>
        <ContainerTablaNotas>
      <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
                {rows.map((row) => (
                <TableRow
                    key={row.titulo}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                    {row.titulo}
                    </TableCell>
                    <TableCell align="left">{row.nota}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </ContainerTablaNotas>
    </Fragment>
  );
}

export default TablaPlanificacionNotas;

let ContainerTablaNotas = styled.div`
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.3rem;
      -webkit-border-radius: 0.3rem;
      -moz-border-radius: 0.3rem;
      -ms-border-radius: 0.3rem;
      -o-border-radius: 0.3rem;
    border: 0.3rem solid black
`