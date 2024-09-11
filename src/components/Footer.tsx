import { Box, Button, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: '20px 0',
        mt: 'auto',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: 'lg',
        margin: '0 auto',
        boxSizing: 'border-box',
        padding: '0 16px',
      }}>
        <Box>
          <Typography variant="body2">
            © 2024
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '8px' }}>
            Тестовое задание на стажировку в Авито.
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '8px' }}>
            Личный кабинет продавца: управление объявлениями и заказами на маркетплейсе.
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '8px' }}>
            Автор: Замула Маргарита.
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Button color="inherit" component={Link} to="/advertisements">
            Объявления
          </Button>
          <Button color="inherit" component={Link} to="/orders">
            Заказы
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;