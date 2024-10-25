// module
import {
    Paper,
    Table as MuiTable,
    TableBody,
    TableCell as MuiTableCell,
    TableHead,
    TableRow as MuiTableRow,
    styled,
    Box,
    useTheme,
} from '@mui/material'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type TableProps<
    TRow extends Record<string, ReactNode>,
    TKey extends keyof TRow,
> = {
    columns: Array<{ headerName: string; field: TKey }>
    rows: Array<TRow>
    isLoading?: boolean
    onRowClick?: (row: TRow) => void
}

const Table = <
    TRow extends Partial<Record<TKey, ReactNode>>,
    TKey extends keyof TRow,
>({
    columns,
    rows,
    isLoading,
    onRowClick,
}: TableProps<TRow, TKey>) => {
    const { t } = useTranslation()

    return (
        <TableContainer>
            <TableWrapper>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                align="center"
                                key={`thead-${col.field.toString()}`}
                            >
                                {t(col.headerName)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                {!!rows.length && (
                    <TableBody>
                        {rows.map((row, rowIndex) => (
                            <TableRow
                                onClick={
                                    onRowClick
                                        ? () => onRowClick(row)
                                        : undefined
                                }
                                key={`row-${rowIndex}`}
                            >
                                {columns.map((col) => (
                                    <TableCell
                                        align="center"
                                        key={`tbody-${col.field.toString()}`}
                                    >
                                        {row[col.field]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </TableWrapper>
            {isLoading && (
                <NoRecordsFound>{t('fetchingRecords')}</NoRecordsFound>
            )}
            {!isLoading && !rows.length && (
                <NoRecordsFound>{t('noRecordsFound')}</NoRecordsFound>
            )}
        </TableContainer>
    )
}

export default Table

const TableContainer = styled(Paper)({
    overflow: 'auto',
    '@media print': {
        boxShadow: 'none',
        direction: 'ltr',
    },
})

const TableWrapper = styled(MuiTable)({
    width: 'max-content',
    minWidth: '100%',
})

const TableRow = styled(MuiTableRow)(({ onClick }) => {
    const theme = useTheme()

    return {
        cursor: onClick ? 'pointer' : 'unset',
        ':hover': {
            backgroundColor: onClick
                ? `${theme.palette.primary.main}33`
                : 'transparent',
        },
    }
})

const TableCell = styled(MuiTableCell)({
    '@media print': {
        border: '1px solid black',
        background: 'white',
        color: 'black',
        fontSize: '0.75rem',
        padding: '2px 16px',
    },
})

const NoRecordsFound = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    height: '250px',
    justifyContent: 'center',
    width: '100%',
})
