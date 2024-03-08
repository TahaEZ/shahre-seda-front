// module
import { useTheme } from '@mui/material'
import styled from '@emotion/styled'

const Error = styled.div(() => {
    const theme = useTheme()

    return {
        boxSizing: 'border-box',
        width: '100%',
        height: '20px',
        paddingInline: '12px',
        fontSize: '12px',
        fontWeight: 400,
        marginTop: '4px',
        color: theme.palette.error.main,
    }
})

export default Error
