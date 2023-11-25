// module
import { useTheme } from '@mui/material'
import styled from '@emotion/styled'

const FormGroupLabel = styled.div<any>(() => {
    const theme = useTheme()

    return {
        boxSizing: 'border-box',
        width: '100%',
        height: 'max-content',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: 500,
        marginBottom: '12px',
        color: (theme.palette.secondary as any)[50]
    }
})

export default FormGroupLabel
