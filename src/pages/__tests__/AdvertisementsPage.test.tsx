import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AdvertisementsPage from '../AdvertisementsPage';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import * as api from '../../services/api';
import { Advertisement } from '../../types';

// Мок для API
vi.mock('../../services/api');

describe('AdvertisementsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает список объявлений после загрузки', async () => {
    const mockAds: Advertisement[] = [
      { id: '1', name: 'Объявление 1', price: 1000, description: 'Описание 1', createdAt: '2023-05-01T12:00:00Z', views: 100, likes: 10, createdByUser: false, imageUrl: '' },
      { id: '2', name: 'Объявление 2', price: 2000, description: 'Описание 2', createdAt: '2023-05-02T12:00:00Z', views: 200, likes: 20, createdByUser: false, imageUrl: '' },
    ];

    vi.spyOn(api, 'getAdvertisements').mockResolvedValue(mockAds);

    render(
      <MemoryRouter>
        <AdvertisementsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Объявление 1')).toBeInTheDocument();
      expect(screen.getByText('Объявление 2')).toBeInTheDocument();
      expect(screen.getByText('Цена: 1000 руб.')).toBeInTheDocument();
      expect(screen.getByText('Цена: 2000 руб.')).toBeInTheDocument();
    });
  });

  it('отображает сообщение, когда объявлений нет', async () => {
    vi.spyOn(api, 'getAdvertisements').mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AdvertisementsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Объявления не найдены')).toBeInTheDocument();
    });
  });

  it('осуществляет поиск по названию объявления', async () => {
    const mockAds: Advertisement[] = [
      { id: '1', name: 'Телефон', price: 1000, description: 'Описание 1', createdAt: '2023-05-01T12:00:00Z', views: 100, likes: 10, createdByUser: false, imageUrl: '' },
      { id: '2', name: 'Ноутбук', price: 2000, description: 'Описание 2', createdAt: '2023-05-02T12:00:00Z', views: 200, likes: 20, createdByUser: false, imageUrl: '' },
    ];

    vi.spyOn(api, 'getAdvertisements').mockResolvedValue(mockAds);

    render(
      <MemoryRouter>
        <AdvertisementsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Телефон')).toBeInTheDocument();
      expect(screen.getByText('Ноутбук')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Поиск по названию'), { target: { value: 'Теле' } });

    await waitFor(() => {
      expect(screen.getByText('Телефон')).toBeInTheDocument();
      expect(screen.queryByText('Ноутбук')).not.toBeInTheDocument();
    });
  });

  it('удаляет объявление, созданное пользователем', async () => {
    const mockAds: Advertisement[] = [
      { id: '1', name: 'Объявление 1', price: 1000, description: 'Описание 1', createdAt: '2023-05-01T12:00:00Z', views: 100, likes: 10, createdByUser: true, imageUrl: '' },
    ];

    vi.spyOn(api, 'getAdvertisements').mockResolvedValue(mockAds);
    vi.spyOn(api, 'deleteAdvertisement').mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AdvertisementsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Объявление 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('delete'));

    await waitFor(() => {
      expect(screen.queryByText('Объявление 1')).not.toBeInTheDocument();
    });
  });
});