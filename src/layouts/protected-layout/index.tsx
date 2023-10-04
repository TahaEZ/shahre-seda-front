// module
import { FC } from 'react'
import { Box, styled } from '@mui/material'
// custom
import Sidebar from './sidebar'
import Content from './content'

interface ProtectedLayoutProps {
    Cmp: FC
}

const ProtectedLayout: FC<ProtectedLayoutProps> = ({ Cmp }) => {
    return (
        <ProtectedLayoutWrapper>
            <Sidebar />
            <Content Cmp={Cmp} />
        </ProtectedLayoutWrapper>
    )
}

const ProtectedLayoutWrapper = styled(Box)({
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'auto',
    margin: 0,
    padding: 0
})

export default ProtectedLayout
