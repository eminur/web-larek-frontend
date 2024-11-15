# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура проекта (MVP)
### Компоненты модели данных

1. Класс ProductListModel
Реализаует каталог товаров. Позволяет заполнять список товаров, получать список товаров, получать товар по идентификатору, получать сумму стоимости товаров.

2. Класс  

### Компоненты представления
### Ключевые типы данных

```typescript
//Идентификатор товара
export type ProductId = string; 

//Категории товаров
export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка';

 //Способ оплаты 
export enum PaymentMethod {
	CARD = 'online',
	CASH = 'при получении',
}

//Валюта 
export enum PriceCurrency {
	PRICLESS = 'Бесценно',
	SYNAPSESS = 'синапсов',
}

//Товар
export interface IProductItem {
	id: ProductId; 
	description: string; 
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

// Контакты заказа
export interface IOrderContact {
	email: string;
	phone: string;
}

//Условие оплаты заказа
export interface IOrderInfo {
	payment: PaymentMethod; // способ оплаты
	address: string;  //адрес доставки
}

//Товары в заказе
export interface IOrderItems {
	total: number; //сумма заказа
	items: ProductId[]; //позиции заказа
}

//Заказ
export type Order = IOrderInfo & IOrderContact & IOrderItems;

//Результат отправки заказа на сервер
export interface IOrderResult {
	id?: string;
	total?: number;
	error?: string;
}

```
 