import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OrdersPage from '../OrdersPage';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import * as api from './../../services/api';
import { Order, OrderStatus } from './../../types';

// Мок для API
vi.mock('../services/api');

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает список заказов после загрузки', async () => {
    const mockOrders: Order[] = [
      { id: '1', total: 1000, items: [], status: OrderStatus.Created, createdAt: '2023-05-01T12:00:00Z', deliveryWay: 'Самовывоз' },
      { id: '2', total: 2000, items: [], status: OrderStatus.Paid, createdAt: '2023-05-02T12:00:00Z', deliveryWay: 'Курьер' },
    ];

    vi.spyOn(api, 'getOrders').mockResolvedValue(mockOrders);

    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Заказ №1/)).toBeInTheDocument();
      expect(screen.getByText(/Заказ №2/)).toBeInTheDocument();
      expect(screen.getByText(/1000 руб./)).toBeInTheDocument();
      expect(screen.getByText(/2000 руб./)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('отображает сообщение, когда заказов нет', async () => {
    vi.spyOn(api, 'getOrders').mockResolvedValue([]);

    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Заказов не найдено')).toBeInTheDocument();
    });
  });

  it('сортирует заказы по сумме', async () => {
    const mockOrders: Order[] = [
      { id: '1', total: 1000, items: [], status: OrderStatus.Created, createdAt: '2023-05-01T12:00:00Z', deliveryWay: 'Самовывоз' },
      { id: '2', total: 2000, items: [], status: OrderStatus.Paid, createdAt: '2023-05-02T12:00:00Z', deliveryWay: 'Курьер' },
    ];

    vi.spyOn(api, 'getOrders').mockResolvedValue(mockOrders);

    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const orders = screen.getAllByText(/Заказ №/);
      expect(orders[0]).toHaveTextContent('Заказ №1');
      expect(orders[1]).toHaveTextContent('Заказ №2');
    }, { timeout: 5000 });

    fireEvent.mouseDown(screen.getByText('Сортировка по сумме'));
    const descendingOption = await screen.findByText('По убыванию');
    fireEvent.click(descendingOption);

    await waitFor(() => {
      const orders = screen.getAllByText(/Заказ №/);
      expect(orders[0]).toHaveTextContent('Заказ №2');
      expect(orders[1]).toHaveTextContent('Заказ №1');
    }, { timeout: 5000 });
  });

  it('изменяет количество заказов на странице', async () => {
    const mockOrders: Order[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Заказ №${i + 1}`,
      total: 1000 * (i + 1),
      items: [],
      status: OrderStatus.Created,
      createdAt: `2023-05-0${i + 1}T12:00:00Z`,
      deliveryWay: 'Самовывоз',
    }));

    vi.spyOn(api, 'getOrders').mockResolvedValue(mockOrders);

    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Заказ №/).length).toBe(5);
    });

    fireEvent.change(screen.getByLabelText('Количество заказов на странице'), { target: { value: '3' } });

    await waitFor(() => {
      expect(screen.getAllByText(/Заказ №/).length).toBe(3);
    });
  });
});