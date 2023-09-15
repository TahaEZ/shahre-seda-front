// module
import { FC } from 'react'
import { Box, styled } from '@mui/material'
// custom
import Sidebar from './sidebar'

interface ProtectedLayoutProps {
    Cmp: FC
}

const ProtectedLayout: FC<ProtectedLayoutProps> = ({ Cmp }) => {
    return (
        <ProtectedLayoutWrapper>
            <Sidebar />
            <Cmp />
        </ProtectedLayoutWrapper>
    )
}

const ProtectedLayoutWrapper = styled(Box)({
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
})

export default ProtectedLayout
