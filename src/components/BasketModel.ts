import { ProductId } from '../types';
import { IEvents } from './base/events';

interface IBasket {
	items: Map<ProductId, number>;
	add(id: ProductId): void;
	remove(id: ProductId): void;
}

export class BasketModel implements IBasket {
	items: Map<ProductId, number> = new Map();

	totalPrice: number;

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
