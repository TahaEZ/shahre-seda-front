// module
import { Box, styled, useTheme } from "@mui/material";
import { FC } from "react";
import { SIDEBAR_WIDTH } from "../../configs/client/sidebar";

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

export default Content

const ContentWrapper = styled(Box)(() => {
    const theme = useTheme()

    return {
        padding: theme.spacing(5),
        paddingInlineStart: `calc(${SIDEBAR_WIDTH}px + ${theme.spacing(5)})`,
    }
})