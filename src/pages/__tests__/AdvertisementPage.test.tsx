import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdvertisementPage from '../AdvertisementPage';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import * as api from '../../services/api';
import { Advertisement } from '../../types';

// Мок для API
vi.mock('../../services/api');

describe('AdvertisementPage', () => {
  const mockAd: Advertisement = {
    id: '1',
    name: 'Тестовое объявление',
    price: 1000,
    description: 'Описание тестового объявления',
    createdAt: '2023-05-01T12:00:00Z',
    views: 100,
    likes: 10,
    createdByUser: true,
    imageUrl: 'https://example.com/image.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает информацию об объявлении', async () => {
    vi.spyOn(api, 'getAdvertisement').mockResolvedValue(mockAd);

    render(
      <MemoryRouter initialEntries={['/advertisement/1']}>
        <Routes>
          <Route path="/advertisement/:id" element={<AdvertisementPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Тестовое объявление')).toBeInTheDocument();
      expect(screen.getByText('Цена: 1000 руб.')).toBeInTheDocument();
      expect(screen.getByText('Описание тестового объявления')).toBeInTheDocument();
    });
  });

  it('позволяет редактировать объявление', async () => {
    vi.spyOn(api, 'getAdvertisement').mockResolvedValue(mockAd);
    vi.spyOn(api, 'updateAdvertisement').mockResolvedValue(mockAd);

    render(
      <MemoryRouter initialEntries={['/advertisement/1']}>
        <Routes>
          <Route path="/advertisement/:id" element={<AdvertisementPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Редактировать')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Редактировать'));

    const nameInput = screen.getByLabelText('Название');
    fireEvent.change(nameInput, { target: { value: 'Обновленное название' } });

    const priceInput = screen.getByLabelText('Цена');
    fireEvent.change(priceInput, { target: { value: '2000' } });

    fireEvent.click(screen.getByText('Сохранить'));

    await waitFor(() => {
      expect(api.updateAdvertisement).toHaveBeenCalledWith('1', expect.objectContaining({
        name: 'Обновленное название',
        price: 2000
      }));
      expect(screen.getByText('Объявление успешно обновлено')).toBeInTheDocument();
    });
  });

  it('отменяет редактирование и возвращает исходные данные', async () => {
    vi.spyOn(api, 'getAdvertisement').mockResolvedValue(mockAd);

    render(
      <MemoryRouter initialEntries={['/advertisement/1']}>
        <Routes>
          <Route path="/advertisement/:id" element={<AdvertisementPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Редактировать')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Редактировать'));

    const nameInput = screen.getByLabelText('Название');
    fireEvent.change(nameInput, { target: { value: 'Измененное название' } });

    fireEvent.click(screen.getByText('Отмена'));

    await waitFor(() => {
      expect(screen.getByText('Тестовое объявление')).toBeInTheDocument();
    });
  });
});

