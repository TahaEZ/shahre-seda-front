// module
import { FC } from 'react'
import { Box, styled } from '@mui/material'

interface PublicLayoutProps {
    Cmp: FC
}

const PublicLayout: FC<PublicLayoutProps> = ({ Cmp }) => {
    return (
        <PublicLayoutWrapper>
            <Cmp />
        </PublicLayoutWrapper>
    )
}

const PublicLayoutWrapper = styled(Box)({
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

export default PublicLayout
