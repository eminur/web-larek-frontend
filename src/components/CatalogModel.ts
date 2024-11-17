import { ProductId, IProductItem } from '../types';
import { IEvents } from './base/events';

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
