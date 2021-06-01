import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import useStyles from './styles';
function ScrapedTable({articleHead,wikiData}) {
    console.log("scraape",wikiData);
    const classes = useStyles();
    return (
            <div>
                <Typography color="textSecondary">Top 10 most frequent words in the wikipedia article on </Typography>
                <Typography color="secondary" align="center">{articleHead}</Typography>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Word</TableCell>
                                        <TableCell align="right">Freqeuncy</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        wikiData?
                                            wikiData.map((element) => (
                                                
                                                <TableRow >
                                                    <TableCell component="th" scope="row">                                                        {element[0]}
                                                        </TableCell>
                                                        <TableCell align="right">{element[1]}</TableCell>
                                                </TableRow>
                                            ))
                                        :(null)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
            </div>
                        
    )
}

export default ScrapedTable
