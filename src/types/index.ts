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
