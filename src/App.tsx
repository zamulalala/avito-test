import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdvertisementsPage from './pages/AdvertisementsPage';
import AdvertisementPage from './pages/AdvertisementPage';
import OrdersPage from './pages/OrdersPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Router>
        <ThemeProvider theme={theme}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/advertisements" replace />} />
            <Route path="/advertisements" element={<AdvertisementsPage />} />
            <Route path="/advertisement/:id" element={<AdvertisementPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
          <Footer />
        </ThemeProvider>
      </Router>
    </Box>
  );
}

export default App;
