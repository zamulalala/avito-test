import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  getStatusName: (status: number) => string;
  onCompleteOrder: (orderId: string) => void;
  onShowItems: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  getStatusName,
  onCompleteOrder,
  onShowItems,
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
      <CardContent sx={{ flexGrow: 1, p: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" }, fontWeight: 'bold', mb: 1 }}>
          Заказ №{order.id}
        </Typography>
        <Typography sx={{ mb: 0.5 }}>Количество товаров: {order.items?.length ?? 0}</Typography>
        <Typography sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>Стоимость: {order.total} руб.</Typography>
        <Typography sx={{ mb: 0.5 }}>Дата создания: {new Date(order.createdAt).toLocaleString()}</Typography>
        <Typography sx={{ mb: 1 }}>Статус: {getStatusName(order.status)}</Typography>
      </CardContent>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {order.status !== OrderStatus.Received && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onCompleteOrder(order.id)}
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
            Завершить заказ
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => onShowItems(order)}
          fullWidth
          sx={{ borderRadius: '10px', padding: '10px 30px' }}
        >
          Состав заказа
        </Button>
      </Box>
    </Card>
  );
};

export default OrderCard;