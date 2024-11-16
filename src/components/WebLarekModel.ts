import {
	ProductId,
	PaymentMethod,
	IProductItem,
	IOrderContact,
	IOrderInfo,
} from '../types';

import { IEvents } from './base/events';

interface IBasket {
	items: Map<ProductId, number>;
	add(id: ProductId): void;
	remove(id: ProductId): void;
}

export class BasketModel implements IBasket {
	items: Map<ProductId, number> = new Map();

	constructor(protected events: IEvents) {}

	add(id: ProductId): void {
		if (!this.items.has(id)) this.items.set(id, 0);
		this.items.set(id, this.items.get(id)! + 1);
		this._changed();
	}

	remove(id: ProductId): void {
		if (!this.items.has(id)) return;
		if (this.items.get(id)! > 0) {
			this.items.set(id, this.items.get(id)! - 1);
			if (this.items.get(id) === 0) this.items.delete(id);
		}
		this._changed();
	}

	protected _changed() {
		this.events.emit('basket:change', {
			items: Array.from(this.items.keys()),
		});
	}

	getTotal() {
		return this.items.size;
	}

	clear(): void {
		this.items.clear();
		this._changed();
	}
}

interface ICatalog {
	items: IProductItem[];
	setItems(items: IProductItem[]): void;
	getItem(id: ProductId): IProductItem;
}

export class CatalogModel implements ICatalog {
	items: IProductItem[] = [];

	constructor(protected events: IEvents) {}

	setItems(items: IProductItem[]): void {
		this.items = items;
		this.events.emit('items:change');
	}

	getItems(): IProductItem[] {
		return this.items;
	}

	getItem(id: ProductId): IProductItem {
		return this.items.find((item) => item.id === id);
	}

	getTotalPrice(ids: ProductId[]) {
		let totalPrice: number = 0;
		ids.forEach((id) => {
			totalPrice += this.getItem(id).price;
		});
		return totalPrice;
	}
}

class OrderInfo implements IOrderInfo {
	payment: PaymentMethod;
	address: string;
}

class OrderContact implements IOrderContact {
	email: string;
	phone: string;
}

export class OrderModel {
	protected _errors: string[];

	orderInfo: OrderInfo = new OrderInfo();
	orderContact: OrderContact = new OrderContact();

	constructor(protected events: IEvents) {}

	setOrderInfo(value: Partial<IOrderInfo>): void {
		this._errors = [];

		Object.assign(this.orderInfo, value);

		if (!this.orderInfo.payment)
			this._errors.push(' Необходимо указать метод оплаты');
		if (!this.orderInfo.address)
			this._errors.push(' Необходимо указать адрес доставки');

		this.events.emit('orderInfo:change', {
			orderInfo: this.orderInfo,
			errors: this._errors,
		});
	}

	getOrderInfo(): IOrderInfo {
		return this.orderInfo;
	}

	setOrderContact(value: Partial<IOrderContact>): void {
		this._errors = [];

		Object.assign(this.orderContact, value);

		if (!this.orderContact.email)
			this._errors.push(' Необходимо указать email');
		if (!this.orderContact.phone)
			this._errors.push(' Необходимо указать телефон');

		this.events.emit('orderContact:change', {
			orderContact: this.orderContact,
			errors: this._errors,
		});
	}

	getOrderContact(): IOrderContact {
		return this.orderContact;
	}
}
