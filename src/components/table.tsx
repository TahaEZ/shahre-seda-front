// module
import { Paper, Table as MuiTable, TableBody, TableCell, TableHead, TableRow as MuiTableRow, styled } from "@mui/material"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

interface TableProps<TRow extends Record<string, ReactNode>, TKey extends keyof TRow> {
    columns: Array<{ headerName: string, field: TKey }>
    rows: Array<TRow>
}

const Table = <TRow extends Record<TKey, ReactNode>, TKey extends keyof TRow>(
    { columns, rows }: TableProps<TRow, TKey>
) => {
    const { t } = useTranslation()

    return (
        <TableContainer>
            <TableWrapper>
                <TableHead>
                    <TableRow>
                        {columns.map(col => (
                            <TableCell align='center' key={(col.field).toString()}>
                                {t(col.headerName)}
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
            </TableWrapper>
        </TableContainer>
    )
}

export default Table

const TableContainer = styled(Paper)({
    overflow: 'auto'
})

const TableWrapper = styled(MuiTable)({
    width: 'max-content',
    minWidth: '100%'
})

const TableRow = styled(MuiTableRow)({
    cursor: 'pointer'
})