import { AppBar, Toolbar, Button, Container, Typography, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const theme = useTheme();

  const buttonStyle = (path: string) => ({
    borderRadius: 0,
    height: '100%',
    borderBottom: location.pathname === path ? `2px solid ${theme.palette.common.white}` : 'none',
    '&:hover': { 
      backgroundColor: theme.palette.primary.light,
      borderBottom: `2px solid ${theme.palette.common.white}`
    }
  });

  return (
    <AppBar position="fixed" color="primary">
      <Container maxWidth="lg">
        <Toolbar sx={{ 
          justifyContent: { xs: 'center', sm: 'center' },
          gap: '20px'
        }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/advertisements"
            sx={buttonStyle('/advertisements')}
          >
            <Typography variant="body1">
              Объявления
            </Typography>
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/orders"
            sx={buttonStyle('/orders')}
          >
            <Typography variant="body1">
              Заказы
            </Typography>
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navigation;