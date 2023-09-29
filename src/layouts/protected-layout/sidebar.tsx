// module
import { FC } from 'react'
import { Box, MenuItem, MenuList, styled, useTheme } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// custom
import sidebarItems, { SIDEBAR_WIDTH } from '../../configs/client/sidebar'
import useStore from '../../store'

const Sidebar: FC = () => {
    const isSidebarOpen = useStore(store => store.isSidebarOpen)
    const location = useLocation()
    const { t } = useTranslation()

    return isSidebarOpen &&
        <SidebarWrapper>
            <MenuList>
                {sidebarItems.map((item) => (
                    <LinkWrapper to={item.route} key={`${item.title} - ${item.route}`}>
                        <SidebarItem isActive={location.pathname === item.route}>
                            {t(item.title)}
                        </SidebarItem>
                    </LinkWrapper>
                ))}
            </MenuList>
        </SidebarWrapper>
}

export default Sidebar

const SidebarWrapper = styled(Box)(() => {
    const theme = useTheme()

    return {
        background: (theme.palette.background as any)['surface2'],
        height: '100%',
        width: SIDEBAR_WIDTH,
        position: 'absolute',
        left: 0,
    }
})

interface SidebarProps {
    isActive: boolean
}

const SidebarItem = styled(MenuItem, { shouldForwardProp: (prop) => prop !== 'isActive' })<SidebarProps>(({ isActive }) => {
    const theme = useTheme()

    return {
        backgroundColor: isActive ? (theme.palette.background as any)['surface3'] : 'transparent',
        color: isActive ? (theme.palette.primary as any)[400] : 'unset',
        padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`
    }
})

const LinkWrapper = styled(Link)({
    color: 'inherit',
    '&:hover': {
        color: 'inherit'
    }
})