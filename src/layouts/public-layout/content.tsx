// module
import { Box, styled } from '@mui/material'
import { FC } from 'react'

interface ContentProps {
    Cmp: FC
}

const Content: FC<ContentProps> = ({ Cmp }) => {
    return (
        <ContentWrapper>
            <Cmp />
        </ContentWrapper>
    )
}

const ContentWrapper = styled(Box)(() => ({
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    padding: 0
}))

export default Content
