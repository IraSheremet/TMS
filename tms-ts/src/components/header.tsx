import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {NotificationsActive} from "@mui/icons-material";
import AuthService from "../services/Authorization/auth.service";

const buttons = [['Тест-кейсы', "/testcases"], ['Тест-планы', "/"]];

const Header: React.FC = () => {
    const token = AuthService.getCurrentAccessToken()

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        AuthService.logout()
    };

    const isProjectOpen = window.location.pathname !== '/';

    const buttonsAtNavBar = () => {
        if (isProjectOpen) {
            return (
                buttons.map(([button_name, path]) => (
                    <Button
                        sx={{
                            color: 'white',
                            fontWeight: 600
                        }}
                        href={path}
                    >
                        {button_name}
                    </Button>
                )))
        }
    }

    return (
        <AppBar position="static" sx={{
            backgroundColor: "#2b2765"
        }}>
            <Container>
                <Toolbar disableGutters>
                    {token ?
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 0,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            TestY
                        </Typography>
                        : <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 0,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            TestY
                        </Typography>
                    }

                    {token ?
                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography
                                        textAlign="center"
                                        component="a"
                                        href="/testcases"
                                        sx={{
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Тест-кейсы
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography
                                        textAlign="center"
                                        component="a"
                                        href="/test-plans"
                                        sx={{
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}>
                                        Тест-планы
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        : <div/>
                    }
                    {token ?
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            TestY
                        </Typography>
                        : <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            TestY
                        </Typography>
                    }
                    {token ? <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, justifyContent: "center"}}>
                        <React.Fragment>
                            {buttonsAtNavBar()}
                        </React.Fragment>
                    </Box> : <div/>}

                    {token ? <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Уведомления">
                            <IconButton>
                                <NotificationsActive sx={{mr: 2, color: 'white'}}/>
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={handleOpenUserMenu}>
                            <AccountCircleIcon sx={{color: 'white'}}/>
                        </IconButton>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {/*const settings = [['Профиль', "/profile"], ['Настройки', "/settings"], ['Выход', "/login"]];*/}
                            {/*{settings.map(([setting_name, path]) => (*/}
                            <MenuItem key={"Профиль"} onClick={handleCloseUserMenu}>
                                <Typography
                                    textAlign="center"
                                    component="a"
                                    href={"/profile"}
                                    sx={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                > Профиль </Typography>
                            </MenuItem>
                            <MenuItem key={"Настройки"} onClick={handleCloseUserMenu}>
                                <Typography
                                    textAlign="center"
                                    component="a"
                                    href={"/settings"}
                                    sx={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                > Настройки </Typography>
                            </MenuItem>
                            <MenuItem key={"Выйти"} onClick={handleLogout}>
                                <Typography
                                    textAlign="center"
                                    component="a"
                                    href={"/login"}
                                    sx={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                > Выход </Typography>
                            </MenuItem>
                            {/*))}*/}
                        </Menu>
                    </Box> : <div/>}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;