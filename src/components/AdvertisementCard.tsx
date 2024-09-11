import React from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Advertisement } from '../types';

interface AdvertisementCardProps {
  ad: Advertisement;
  onAdClick: (adId: string) => void;
  onOrdersClick: (adId: string) => void;
  onDeleteClick: (adId: string) => void;
  canDeleteAd: (ad: Advertisement) => boolean;
  getImageSource: (ad: Advertisement) => string;
  handleImageError: (adId: string) => void;
}

const AdvertisementCard: React.FC<AdvertisementCardProps> = ({
  ad,
  onAdClick,
  onOrdersClick,
  onDeleteClick,
  canDeleteAd,
  getImageSource,
  handleImageError,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
        },
      }}
    >
      <CardActionArea onClick={() => onAdClick(ad.id)}>
        <CardMedia
          component="img"
          sx={{
            aspectRatio: "1 / 1",
            objectFit: "cover",
          }}
          image={getImageSource(ad)}
          alt={ad.name}
          onError={() => handleImageError(ad.id)}
        />
      </CardActionArea>
      <CardContent sx={{ p: { xs: 1, sm: 2 }, flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          {ad.name}
        </Typography>
        <Typography sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>Цена: {ad.price} руб.</Typography>
        <Typography sx={{ mb: 0.5 }}>Просмотры: {ad.views}</Typography>
        <Typography sx={{ mb: 1 }}>Лайки: {ad.likes}</Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={2}
          gap={1}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => onAdClick(ad.id)}
            size="small"
            fullWidth
            sx={{ borderRadius: '10px', padding: '10px 30px' }}
          >
            Подробнее
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ShoppingCartIcon />}
            onClick={() => onOrdersClick(ad.id)}
            size="small"
            fullWidth
            sx={{ 
              borderRadius: '10px', 
              padding: '10px 30px',
              borderColor: '#ff1744',
              color: '#ff1744',
              '&:hover': {
                backgroundColor: 'rgba(245, 0, 87, 0.1)',
                borderColor: '#b2102f',
              }
            }}
          >
            Заказы
          </Button>
        </Box>
      </CardContent>
      {canDeleteAd(ad) && (
        <IconButton
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(ad.id);
          }}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
            padding: { xs: "4px", sm: "8px" },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Card>
  );
};

export default AdvertisementCard;