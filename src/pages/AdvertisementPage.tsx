import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Container,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { getAdvertisement, updateAdvertisement } from "../services/api";
import { Advertisement } from "../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import boxImage from "./../assets/images/box.png";
import axios from "axios";
import Loader from "../components/Loader";

function AdvertisementPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [originalAd, setOriginalAd] = useState<Advertisement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [notFound, setNotFound] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const maxDescriptionLength = 100; // Максимальная длина описания перед сворачиванием

  useEffect(() => {
    const controller = new AbortController();
    if (id) {
      fetchAdvertisement(id, controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, [id]);

  const fetchAdvertisement = async (adId: string, signal: AbortSignal) => {
    try {
      // Устанавливаем загрузку только если это новый запрос
      if (!isLoading) setIsLoading(true);
      
      setNotFound(false);
      const data = await getAdvertisement(adId, signal);
      if (data) {
        setAd(data);
        setOriginalAd(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError("Не удалось загрузить объявление");
        setNotFound(true);
      }
    } finally {
      // Проверяем, если запрос не был отменен, сбрасываем состояние загрузки
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = () => setIsEditing(true);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!ad) return errors;

    if (!ad.name.trim()) {
      errors.name = "Название не может быть пустым";
    }

    const price = typeof ad.price === "string" ? ad.price : ad.price.toString();
    if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
      errors.price = "Цена должна быть неотрицательным числом";
    }

    if (ad.imageUrl && !isValidImageUrl(ad.imageUrl)) {
      errors.imageUrl = "Некорректный URL изображения";
    }

    setFormErrors(errors);
    return errors;
  };

  const isValidImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  const handleSave = async () => {
    if (ad && id) {
      const errors = validateForm();
      if (Object.keys(errors).length === 0) {
        try {
          setIsLoading(true);
          await updateAdvertisement(id, ad);
          setIsEditing(false);
          setOriginalAd(ad);
          setError("Объявление успешно обновлено");
        } catch {
          setError("Не удалось обновить объявление");
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (ad) {
      const { name, value } = e.target;
      let newValue: string | number = value;

      if (name === "price") {
        // Разрешаем пустую строку или неотрицательное число
        newValue = value === "" ? "" : Math.max(0, Number(value));
      }

      setAd({ ...ad, [name]: newValue });
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleCancel = () => {
    setAd(originalAd);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleBack = () => navigate(-1);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSource = () => {
    if (imageError || !ad?.imageUrl) {
      return boxImage;
    }
    return ad.imageUrl;
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const getDisplayedDescription = () => {
    if (!ad?.description) return "Описание отсутствует";
    if (ad.description.length <= maxDescriptionLength || isDescriptionExpanded) {
      return ad.description;
    }
    return `${ad.description.slice(0, maxDescriptionLength)}...`;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (notFound) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h6">Объявление не найдено</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {ad && (
          <>
            <Box
              sx={{
                width: { xs: "90%", md: "70%" },
                margin: "0 auto",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                marginBottom: "70px",
                marginTop: "70px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "16px",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  variant="outlined"
                  color="secondary" 
                  sx={{ borderRadius: "10px", padding: "10px 20px" }}
                >
                  Назад
                </Button>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ textTransform: "uppercase" }}
                >
                  {ad.name}
                </Typography>
              </Box>
            </Box>

            <Card
              sx={{
                maxWidth: 400,
                borderRadius: 5,
                margin: "0 auto",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                image={getImageSource()}
                alt={ad.name}
                onError={handleImageError}
              />
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {isEditing ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      name="name"
                      value={ad.name}
                      onChange={handleChange}
                      label="Название"
                      fullWidth
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                    />
                    <TextField
                      name="price"
                      value={ad.price === 0 ? "" : ad.price}
                      onChange={handleChange}
                      label="Цена"
                      type="number"
                      fullWidth
                      error={!!formErrors.price}
                      helperText={formErrors.price}
                    />
                    <TextField
                      name="description"
                      value={ad.description}
                      onChange={handleChange}
                      label="Описание (необязательно)"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!formErrors.description}
                      helperText={formErrors.description}
                    />
                    <TextField
                      name="imageUrl"
                      value={ad.imageUrl}
                      onChange={handleChange}
                      label="URL изображения (необязательно)"
                      fullWidth
                      error={!!formErrors.imageUrl}
                      helperText={
                        formErrors.imageUrl ||
                        "Оставьте пустым, если не хотите добавлять изображение"
                      }
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={isLoading}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: "10px", padding: "10px 20px" }}
                      >
                        Сохранить
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: "10px", padding: "10px 20px" }}
                      >
                        Отмена
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
                    >
                      Цена: {ad.price} руб.
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {getDisplayedDescription()}
                    </Typography>
                    {ad.description && ad.description.length > maxDescriptionLength && (
                      <Button
                        onClick={toggleDescription}
                        color="primary"
                        sx={{ mt: -2, mb: 2 }}
                      >
                        {isDescriptionExpanded ? "Свернуть" : "Развернуть"}
                      </Button>
                    )}
                    <Button
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      sx={{ borderRadius: "10px", padding: "10px 30px" }}
                    >
                      Редактировать
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Container>
  );
}

export default AdvertisementPage;
