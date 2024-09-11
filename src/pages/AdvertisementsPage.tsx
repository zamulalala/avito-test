import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Modal,
  FormControl,
  InputLabel,
  IconButton,
  SelectChangeEvent,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getAdvertisements,
  createAdvertisement,
  deleteAdvertisement,
} from "../services/api";
import boxImage from "./../assets/images/box.png";
import { Advertisement } from "../types";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Loader from '../components/Loader';
import axios from "axios";
import Fade from '@mui/material/Fade';
import CustomPagination from '../components/CustomPagination';
import AdvertisementCard from '../components/AdvertisementCard';
import CardGrid from '../components/CardGrid';

function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPageInput, setItemsPerPageInput] = useState<string>("10");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAd, setNewAd] = useState<Partial<Advertisement>>({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof Advertisement, string>>
  >({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [viewsFilter, setViewsFilter] = useState<string>("");
  const [likesFilter, setLikesFilter] = useState<string>("");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchAdvertisements(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchAdvertisements = async (signal?: AbortSignal) => {
    try {
      // Устанавливаем загрузку только если это новый запрос
      if (!isLoading) setIsLoading(true);
      
      const fetchedAds = await getAdvertisements(signal);
      const convertedAds: Advertisement[] = fetchedAds.map((ad) => ({
        ...ad,
        id: ad.id?.toString() || "",
        name: ad.name || "Без названия",
        price: ad.price || 0,
        views: ad.views || 0,
        likes: ad.likes || 0,
        createdByUser: ad.createdByUser || false,
      }));
      setAdvertisements(convertedAds);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Ошибка при загрузке объявлений:", error);
        setAdvertisements([]);
      }
    } finally {
      // Проверяем, если запрос не был отменен, сбрасываем состояние загрузки
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePriceFilterChange = (event: SelectChangeEvent<string>) => {
    setPriceFilter(event.target.value);
  };

  const handleViewsFilterChange = (event: SelectChangeEvent<string>) => {
    setViewsFilter(event.target.value);
  };

  const handleLikesFilterChange = (event: SelectChangeEvent<string>) => {
    setLikesFilter(event.target.value);
  };

  const filteredAdvertisements = advertisements.filter((ad) => {
    const matchesSearch = ad.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      priceFilter === "" || ad.price <= parseInt(priceFilter);
    const matchesViews =
      viewsFilter === "" || ad.views >= parseInt(viewsFilter);
    const matchesLikes =
      likesFilter === "" || ad.likes >= parseInt(likesFilter);
    return matchesSearch && matchesPrice && matchesViews && matchesLikes;
  });

  const paginatedAdvertisements = filteredAdvertisements.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setItemsPerPageInput(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setItemsPerPage(numValue);
      setPage(1);
    } else if (value === "") {
      setItemsPerPage(10);
      setPage(1);
    }
  };

  const handleAdClick = (adId: string) => {
    navigate(`/advertisement/${adId}`);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Advertisement, string>> = {};

    if (!newAd.name || newAd.name.trim() === "") {
      newErrors.name = "Название обязательно";
    }

    if (!newAd.price || newAd.price <= 0) {
      newErrors.price = "Цена должна быть больше нуля";
    }

    if (newAd.imageUrl && !isValidImageUrl(newAd.imageUrl)) {
      newErrors.imageUrl = "Некорректная ссылка на изображение";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidImageUrl = (url: string): boolean => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  const handleCreateAd = async () => {
    if (validateForm()) {
      try {
        const adToCreate: Omit<Advertisement, "id" | "createdAt"> = {
          name: newAd.name || "",
          price: newAd.price || 0,
          description: newAd.description || "",
          imageUrl:
            newAd.imageUrl && isValidImageUrl(newAd.imageUrl)
              ? newAd.imageUrl
              : "",
          createdByUser: true,
          views: 0,
          likes: 0,
        };

        const createdAd = await createAdvertisement(adToCreate);
        setIsModalOpen(false);
        setNewAd({});
        setAdvertisements((prevAds) => [...prevAds, createdAd]);
      } catch (error) {
        console.error("Ошибка при создании объявления:", error);
      }
    }
  };

  const canDeleteAd = (ad: Advertisement): boolean => {
    return ad.createdByUser === true;
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      await deleteAdvertisement(adId);
      const updatedAds = advertisements.filter((ad) => ad.id !== adId);
      setAdvertisements(updatedAds);

      const filteredAds = updatedAds.filter((ad) =>
        ad.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
      if (page > totalPages && page > 1) {
        setPage((prevPage) => prevPage - 1);
      }
    } catch (error) {
      console.error("Ошибка при удалении объявления:", error);
    }
  };

  const handleImageError = (adId: string) => {
    setImageErrors((prev) => ({ ...prev, [adId]: true }));
  };

  const getImageSource = (ad: Advertisement) => {
    if (imageErrors[ad.id] || !ad.imageUrl) {
      return boxImage;
    }
    return ad.imageUrl;
  };

  const handleOrdersClick = (adId: string) => {
    navigate(`/orders?adId=${adId}`);
  };

  useEffect(() => {
    if (paginatedAdvertisements.length === 0 && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [paginatedAdvertisements, page]);

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
            <Typography variant="h5" component="h1" sx={{ textTransform: 'uppercase', mr: '20px'}}>
              ОБЪЯВЛЕНИЯ
            </Typography>
            <IconButton
              color="secondary"
              aria-label="создать объявление"
              onClick={() => setIsModalOpen(true)}
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#ff1744',
                '&:hover': {
                  backgroundColor: '#b2102f',
                },
              }}
            >
              <AddIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск по названию"
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
            onChange={handleSearchChange}
          />

          <FormControl fullWidth>
            <InputLabel>Цена до</InputLabel>
            <Select
              value={priceFilter}
              onChange={handlePriceFilterChange}
              label="Цена до"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="1000">До 1000</MenuItem>
              <MenuItem value="5000">До 5000</MenuItem>
              <MenuItem value="10000">До 10000</MenuItem>
              <MenuItem value="50000">До 50000</MenuItem>
              <MenuItem value="100000">До 100000</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Просмотры от</InputLabel>
            <Select
              value={viewsFilter}
              onChange={handleViewsFilterChange}
              label="Просмотры от"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="100">От 100</MenuItem>
              <MenuItem value="500">От 500</MenuItem>
              <MenuItem value="1000">От 1000</MenuItem>
              <MenuItem value="5000">От 5000</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Лайки от</InputLabel>
            <Select
              value={likesFilter}
              onChange={handleLikesFilterChange}
              label="Лайки от"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="10">От 10</MenuItem>
              <MenuItem value="50">О 50</MenuItem>
              <MenuItem value="100">От 100</MenuItem>
              <MenuItem value="500">От 500</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Количество объявлений на странице"
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            value={itemsPerPageInput}
            onChange={handleItemsPerPageChange}
          />
        </Box>

        {isLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 'calc(100vh - 200px)', // Примерная высота, учитывающая верхние элементы
            }}
          >
            <Loader />
          </Box>
        ) : (
          <>
            {paginatedAdvertisements.length === 0 ? (
              <Fade in={true}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '200px' 
                  }}
                >
                  <Typography variant="h6" align="center">
                    Объявления не найдены
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <CardGrid itemCount={paginatedAdvertisements.length}>
                {paginatedAdvertisements.map((ad) => (
                  <AdvertisementCard
                    key={ad.id}
                    ad={ad}
                    onAdClick={handleAdClick}
                    onOrdersClick={handleOrdersClick}
                    onDeleteClick={handleDeleteAd}
                    canDeleteAd={canDeleteAd}
                    getImageSource={getImageSource}
                    handleImageError={handleImageError}
                  />
                ))}
              </CardGrid>
            )}
          </>
        )}
        <CustomPagination
          count={Math.ceil(filteredAdvertisements.length / itemsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
            }}
          >
            <Typography variant="h6" component="h2">
              Создать новое объявление
            </Typography>
            <TextField
              fullWidth
              label="URL изображения (необязательно)"
              value={newAd.imageUrl || ""}
              onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}              margin="normal"
              error={!!errors.imageUrl}
              helperText={
                errors.imageUrl ||
                "Оставьте пустым, если не хотите добавлять изображение"}
            />
            <TextField
              fullWidth
              label="Название"
              value={newAd.name || ""}
              onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
              margin="normal"
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              label="Описание (необязательно)"
              value={newAd.description || ""}
              onChange={(e) =>
                setNewAd({ ...newAd, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Стоимость"
              type="number"
              value={newAd.price || ""}
              onChange={(e) =>
                setNewAd({ ...newAd, price: Number(e.target.value) })
              }
              margin="normal"
              required
              error={!!errors.price}
              helperText={errors.price}
            />
            <Button variant="contained" onClick={handleCreateAd} sx={{ mt: 2 }}>
              Создать
            </Button>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
}
export default AdvertisementsPage;
