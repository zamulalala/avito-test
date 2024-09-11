import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Container,
  Fade
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useNavigate, useLocation } from "react-router-dom";
import { Order, OrderStatus, OrderStatusTranslation } from "../types";
import { getOrders, updateOrder } from "../services/api";
import Loader from '../components/Loader';
import axios from "axios";
import CustomPagination from '../components/CustomPagination';
import OrderCard from '../components/OrderCard';
import CardGrid from '../components/CardGrid';

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [ordersPerPageInput, setOrdersPerPageInput] = useState<string>("5");
  const [ordersPerPage, setOrdersPerPage] = useState<number>(5);
  const [showReturnButton, setShowReturnButton] = useState(false);
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const adId = searchParams.get("adId");
    setSelectedAdId(adId);
    setShowReturnButton(!!adId);
    filterOrders(adId);
  }, [orders, location.search, statusFilter, sortDirection]);

  useEffect(() => {
    const sorted = [...filteredOrders].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.total - b.total;
      } else {
        return b.total - a.total;
      }
    });
    setSortedOrders(sorted);
  }, [filteredOrders, sortDirection]);

  const fetchOrders = async (signal?: AbortSignal) => {
    try {
      // Устанавливаем загрузку только если это новый запрос
      if (!isLoading) setIsLoading(true);
      
      const data = await getOrders(signal);
      
      const validOrders = data.filter(order => order && Array.isArray(order.items));
      setOrders(validOrders);
      setFilteredOrders(validOrders);
    } catch (error) {
      // Если запрос был отменен, не сбрасываем состояние и не показываем ошибку
      if (!axios.isCancel(error)) {
        console.error("Ошибка при загрузке заказов:", error);
        setOrders([]);
        setFilteredOrders([]);
      }
    } finally {
      // Проверяем, если запрос не был отменен, сбрасываем состояние загрузки
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  const filterOrders = (adId: string | null) => {
    let filtered = orders;

    if (adId) {
      filtered = filtered.filter((order) =>
        order.items && Array.isArray(order.items) && order.items.some((item) => item && item.id === adId)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setPage(1);
  };

  const handleViewAllOrders = () => {
    navigate("/orders");
  };

  const handleReturnToAdvertisements = () => {
    navigate("/advertisements");
  };

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleOrdersPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setOrdersPerPageInput(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setOrdersPerPage(numValue);
      setPage(1);
    } else if (value === "") {
      setOrdersPerPage(1);
      setPage(1);
    }
  };

  const handleStatusFilterChange = (
    event: SelectChangeEvent<number | "all">
  ) => {
    setStatusFilter(event.target.value as number | "all");
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortDirection(event.target.value as "asc" | "desc");
  };

  const getStatusName = (status: number): string => {
    const statusKey = Object.keys(OrderStatus).find(
      (key) => OrderStatus[key as keyof typeof OrderStatus] === status
    ) as keyof typeof OrderStatus;
    return OrderStatusTranslation[statusKey] || "Неизвестно";
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await updateOrder(orderId, { status: OrderStatus.Received });
      fetchOrders();
    } catch (error) {
      console.error("Ошибка при завершении заказа:", error);
    }
  };

  const handleShowItems = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleItemClick = (advertisementId: string) => {
    navigate(`/advertisement/${advertisementId}`);
  };

  const indexOfLastOrder = page * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            width: { xs: '90%', md: '70%' },
            margin: '0 auto',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            marginBottom: '70px',
            marginTop: '70px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Box display="flex" justifyContent="end" alignItems="center" width="100%">
            <Typography variant="h5" component="h1" sx={{ textTransform: 'uppercase', mr: '20px' }}>
              ЗАКАЗЫ
            </Typography>
          </Box>
  
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Статус"
            >
              <MenuItem value="all">Все</MenuItem>
              {Object.entries(OrderStatus).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {OrderStatusTranslation[key as keyof typeof OrderStatus]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <Select
            fullWidth
            value={sortDirection}
            onChange={handleSortChange}
            displayEmpty
            renderValue={(value) => (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ mr: 1 }}>Сортировка по сумме</Typography>
                {value === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </Box>
            )}
          >
            <MenuItem value="asc">По возрастанию</MenuItem>
            <MenuItem value="desc">По убыванию</MenuItem>
          </Select>
  
          <TextField
            fullWidth
            label="Количество заказов на странице"
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            value={ordersPerPageInput}
            onChange={handleOrdersPerPageChange}
          />
  
          {showReturnButton && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleReturnToAdvertisements}
              fullWidth
              sx={{ borderRadius: '10px', padding: '10px 30px' }}
            >
              Вернуться к объявлениям
            </Button>
          )}
        </Box>
  
        {/* Прелоадер показывается, пока идет загрузка */}
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Показываем сообщение "Заказов не найдено", если заказы не были найдены */}
            {filteredOrders.length === 0 ? (
              <Fade in={true}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '200px',
                    gap: 2
                  }}
                >
                  <Typography variant="h6" align="center">
                    {selectedAdId
                      ? "Заказов с выбранным товар��м не найдено"
                      : "Заказов не найдено"}
                  </Typography>
                  {selectedAdId && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleViewAllOrders}
                      sx={{ borderRadius: '10px', padding: '10px 30px' }}
                    >
                      Посмотреть все заказы
                    </Button>
                  )}
                </Box>
              </Fade>
            ) : (
              <CardGrid itemCount={currentOrders.length}>
                {currentOrders.map((order) => (
                  order ? (
                    <OrderCard
                      key={order.id}
                      order={order}
                      getStatusName={getStatusName}
                      onCompleteOrder={handleCompleteOrder}
                      onShowItems={handleShowItems}
                    />
                  ) : null
                ))}
              </CardGrid>
            )}
          </>
        )}
  
        <CustomPagination
          count={Math.ceil(filteredOrders.length / ordersPerPage)}
          page={page}
          onChange={handlePageChange}
        />
  
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Товары в заказе
            </Typography>
            <List>
              {selectedOrder?.items.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton onClick={() => handleItemClick(item.id)}>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Цена: {item.price} руб.
                          </Typography>
                          {" — Количество: " + item.count}
                        </React.Fragment>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>
      </Box>
    </Container>
  );  
}  

export default OrdersPage;
