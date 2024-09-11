import axios, { AxiosRequestConfig } from 'axios';
import { Advertisement, Order } from '../types';

const isGitHubPages = window.location.hostname.includes('github.io');

const API_URL = isGitHubPages
  ? 'https://my-json-server.typicode.com/zamulalala/avito-test'
  : 'http://localhost:3000';
// const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  // headers: {
  //   'Authorization': `Bearer ${API_KEY}`
  // }
});

// Объявления
export const getAdvertisements = (signal?: AbortSignal) => 
  makeRequest<Advertisement[]>({ method: 'GET', url: '/advertisements', signal });

export const getAdvertisement = async (id: string, signal?: AbortSignal): Promise<Advertisement> => {
  try {
    const response = await api.get<Advertisement>(`/advertisements/${id}`, { signal });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    }
    throw error;
  }
};

export const updateAdvertisement = async (id: string, advertisement: Partial<Advertisement>) => {
  try {
    const response = await api.patch<Advertisement>(`/advertisements/${id}`, advertisement);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении объявления:', error);
    throw error;
  }
};

export const createAdvertisement = async (ad: Omit<Advertisement, "id" | "createdAt">): Promise<Advertisement> => {
  const response = await fetch(`${API_URL}/advertisements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ad),
  });
  if (!response.ok) {
    throw new Error('Не удалось создать объявление');
  }
  return response.json();
};

export const deleteAdvertisement = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/advertisements/${id}`, {  // Изменено с http://localhost:3000 на ${API_URL}
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Ошибка при удалении объявления');
    }
  } catch (error) {
    console.error('Ошибка при удалении объявления:', error);
    throw error;
  }
};

// Заказы
export const getOrders = (signal?: AbortSignal) => 
  makeRequest<Order[]>({ method: 'GET', url: '/orders', signal });

export const getOrder = async (id: string) => {
  try {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
    throw error;
  }
};

export const updateOrder = async (id: string, order: Partial<Order>) => {
  try {
    const response = await api.patch<Order>(`/orders/${id}`, order);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error);
    throw error;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    await api.delete(`/orders/${id}`);
  } catch (error) {
    console.error('Ошибка при удалении заказа:', error);
    throw error;
  }
};

export const createAbortController = () => new AbortController();

export const makeRequest = async <T>(
  config: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    }
    throw error;
  }
};