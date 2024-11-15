import {
	IProductItem,
	PriceCurrency,
	ProductCategory,
	ProductId,
} from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { EventEmitter } from './base/events';
import { settings } from '../utils/constants';

export class Card extends Component<IProductItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _itemId: ProductId;

	constructor(container: HTMLElement) {
		super(container);
		this._title = ensureElement('.card__title', this.container);
		this._price = ensureElement('.card__price', this.container);
	}

	set id(value: ProductId) {
		this._itemId = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value) {
			this.setText(this._price, String(value) + ' ' + PriceCurrency.SYNAPSESS);
		} else {
			this.setText(this._price, PriceCurrency.PRICLESS);
		}
	}
}

export class CardImage extends Card {
	protected _category: HTMLElement;
	protected _image?: HTMLImageElement;

	constructor(container: HTMLElement) {
		super(container);
		this._category = ensureElement('.card__category', this.container);
		this._image = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;
	}

	set category(value: ProductCategory) {
		this._category.classList.add(settings[value]);
		this.setText(this._category, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this._title.textContent || '');
	}
}

export class CardCatalog extends CardImage {
	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.container.addEventListener('click', () =>
			this.events.emit('item:select', { id: this._itemId })
		);
	}
}

export class CardPreview extends CardImage {
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._button = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;
		this._button.addEventListener('click', () =>
			this.events.emit('item:addbasket', { id: this._itemId })
		);
	}
}

export class CardBasket extends Card {
  protected _index: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
    this._index = ensureElement('.basket__item-index', this.container);
		this._button = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;
		this._button.addEventListener('click', () =>
			this.events.emit('item:deletebasket', { id: this._itemId })
		);
	}

  set index(value: number){
    this.setText(this._index,String(value));
  }
}
