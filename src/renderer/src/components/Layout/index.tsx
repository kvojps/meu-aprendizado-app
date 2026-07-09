import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  SchoolOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { useThemeMode } from '@/hooks/useThemeMode';
import { ROUTES } from '../../routes';

interface LayoutProps {
  children: ReactNode;
}

const APP_NAME = 'Meu Aprendizado';

const NAV_ITEMS = [
  {
    label: 'Aprendizados',
    path: ROUTES.APRENDIZADOS,
    icon: <SchoolOutlined fontSize="small" />,
  },
  {
    label: 'Configurações',
    path: ROUTES.SETTINGS,
    icon: <SettingsOutlined fontSize="small" />,
  },
];

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  function go(path: string) {
    navigate(path);
    setDrawerOpen(false);
  }

  function isActive(path: string) {
    return path === ROUTES.APRENDIZADOS
      ? location.pathname.startsWith(ROUTES.APRENDIZADOS)
      : location.pathname === path;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              mr: isMobile ? 'auto' : 4,
            }}
            onClick={() => go(ROUTES.APRENDIZADOS)}
          >
            <Box component="img" src={logo} alt="" width={28} height={28} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {APP_NAME}
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.path}
                    onClick={() => go(item.path)}
                    startIcon={item.icon}
                    color={active ? 'primary' : 'inherit'}
                    sx={{
                      fontWeight: active ? 700 : 500,
                      bgcolor: active ? 'action.selected' : 'transparent',
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <IconButton onClick={toggleMode} aria-label="Alternar tema" color="inherit">
            {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation">
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.path}
                selected={isActive(item.path)}
                onClick={() => go(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
