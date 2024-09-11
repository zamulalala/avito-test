export type Advertisement = {
    /* Уникальный идентификатор. */
    id: string;
    /* Название. */
    name: string;
    /* Описание. */
    description?: string;
    /* Цена. */
    price: number;
    /* Дата и время создания. */
    createdAt: string;
    /* Количество просмотров. */
    views: number;
    /* Количество лайков. */
    likes: number;
    /* Ссылка на изображение. */
    imageUrl?: string;
    /* Флаг, указывающий, что объявление создано через модальное окно */
    createdByUser: boolean;
};

export const OrderStatus = {
    Created: 0,
    Paid: 1,
    Transport: 2,
    DeliveredToThePoint: 3,
    Received: 4,
    Archived: 5,
    Refund: 6
} as const;

export const OrderStatusTranslation: Record<keyof typeof OrderStatus, string> = {
    Created: 'Создан',
    Paid: 'Оплачен',
    Transport: 'В пути',
    DeliveredToThePoint: 'Доставлен в пункт выдачи',
    Received: 'Получен',
    Archived: 'Архивирован',
    Refund: 'Возврат'
};

export type OrderItem = Advertisement & { count: number; };

export type Order = {
    /* Уникальный идентификатор. */
    id: string;
    /* Статус. */
    status: typeof OrderStatus[keyof typeof OrderStatus];
    /* Дата и время создания. */
    createdAt: string;
    /* Дата и время завершения. */
    finishedAt?: string;
    /* Товары в заказе. */
    items: Array<OrderItem>;
    /* Способ доставки(Почта, СДЭК...) */
    deliveryWay: string;
    /* Сумма заказа */
    total: number;
}

export type Image = {
    /* Уникальный идентификатор. */
    id: number;
    /* Ссылка. */
    url: string;
    /* Название. */
    name: string;
}
