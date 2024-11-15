import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface ISuccess {
	totalPrice: number;
}

export class Success extends Component<ISuccess> {
	protected _totalPrice: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._totalPrice = ensureElement(
			'.order-success__description',
			this.container
		);
		this._button = ensureElement(
			'.order-success__close',
			this.container
		) as HTMLButtonElement;
		this._button.addEventListener('click', () => {
			this.events.emit('success:close');
		});
	}

	set totalPrice(value: number) {
		this.setText(this._totalPrice, `Списано ${value} синапсов`);
	}
}
