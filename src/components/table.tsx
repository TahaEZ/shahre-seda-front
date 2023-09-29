import { Paper, Table as MuiTable, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { ReactNode } from "react"

interface TableProps<TRow extends Record<string, ReactNode>, TKey extends keyof TRow> {
    columns: Array<{ headerName: string, field: TKey }>
    rows: Array<TRow>
}

const Table = <TRow extends Record<TKey, ReactNode>, TKey extends keyof TRow>(
    { columns, rows }: TableProps<TRow, TKey>
) => {
    return (
        <Paper>
            <MuiTable>
                <TableHead>
                    <TableRow>
                        {columns.map(col => (
                            <TableCell align='center' key={(col.field).toString()}>
                                {col.headerName}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) =>
                        <TableRow key={`row-${rowIndex}`}>
                            {columns.map(col => (
                                <TableCell align='center'>{row[col.field]}</TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </MuiTable>
        </Paper>
    )
}

export default Table