// module
import { FC } from 'react'
import { Box, styled } from '@mui/material'
// custom
import Content from './content'

interface PublicLayoutProps {
    Cmp: FC
}

const PublicLayout: FC<PublicLayoutProps> = ({ Cmp }) => {
    return (
        <PublicLayoutWrapper>
            <Content Cmp={Cmp} />
        </PublicLayoutWrapper>
    )
}

const PublicLayoutWrapper = styled(Box)({
    boxSizing: 'border-box',
    height: '100%',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
})

export default PublicLayout
