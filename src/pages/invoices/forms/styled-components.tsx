// module
import styled from '@emotion/styled'
import { Box, useTheme } from '@mui/material'

export const ActionButtonsBox = styled(Box)(() => {
    const theme = useTheme()

    return {
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: theme.spacing(3),
        justifyContent: 'space-between',
    }
})

export const ButtonBox = styled(Box)({
    width: 250,
})
