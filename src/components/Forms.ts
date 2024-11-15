import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IOrderInfo, IOrderContact, PaymentMethod } from '../types';

interface IFormOrderInfo {
	orderInfo: IOrderInfo;
	errors: string[];
}

export class FormOrderInfo extends Component<IFormOrderInfo> {
	protected _buttonCash: HTMLButtonElement;
	protected _buttonCard: HTMLButtonElement;
	protected _submit: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected _errors: HTMLElement;
	protected _payment: PaymentMethod | null = null;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._buttonCash = ensureElement(
			"button[name='cash']",
			this.container
		) as HTMLButtonElement;
		this._buttonCard = ensureElement(
			"button[name='card']",
			this.container
		) as HTMLButtonElement;
		this._submit = ensureElement(
			'button[type=submit]',
			this.container
		) as HTMLButtonElement;
		this._address = ensureElement(
			"input[name='address']",
			this.container
		) as HTMLInputElement;
		this._errors = ensureElement('.form__errors', this.container);

		this._buttonCash.addEventListener('click', (evt) => {
			this._payment = PaymentMethod.CASH;
			this.switchButton();
			this.events.emit('formOrderInfo:change', { payment: this._payment });
		});

		this._buttonCard.addEventListener('click', (evt) => {
			this._payment = PaymentMethod.CARD;
			this.switchButton();
			this.events.emit('formOrderInfo:change', { payment: this._payment });
		});

		this.container.addEventListener('input', (evt) => {
			this.events.emit('formOrderInfo:change', {
				address: this._address.value,
			});
		});

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit('formOrderInfo:submit');
		});
	}

	protected switchButton() {
		this._buttonCard.classList.remove('button_alt-active');
		this._buttonCash.classList.remove('button_alt-active');

		if (this._payment === PaymentMethod.CARD) {
			this._buttonCard.classList.add('button_alt-active');
		}

		if (this._payment === PaymentMethod.CASH) {
			this._buttonCash.classList.add('button_alt-active');
		}
	}

	set errors(value: string[]) {
		this.setText(this._errors, value);
		this.setDisabled(this._submit, value.length > 0);
	}

	set orderInfo(value: IOrderInfo) {
		if ('address' in value) this._address.value = value.address;
		if ('payment' in value) {
			this._payment = value.payment;
			this.switchButton();
		}
	}
}

interface IFormOrderContact {
	orderContact: IOrderContact;
	errors: string[];
}

export class FormOrderContact extends Component<IFormOrderContact> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	protected _errors: HTMLElement;
	protected _submit: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._submit = ensureElement(
			'button[type=submit]',
			this.container
		) as HTMLButtonElement;
		this._email = ensureElement(
			"input[name='email']",
			this.container
		) as HTMLInputElement;
		this._phone = ensureElement(
			"input[name='phone']",
			this.container
		) as HTMLInputElement;
		this._errors = ensureElement('.form__errors', this.container);

		this.container.addEventListener('input', (evt) => {
			if (evt.target === this._email)
				this.events.emit('formOrderContact:change', {
					email: this._email.value,
				});
			if (evt.target === this._phone)
				this.events.emit('formOrderContact:change', {
					phone: this._phone.value,
				});
		});

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit('formOrderContact:submit');
		});
	}

	set errors(value: string[]) {
		this.setText(this._errors, value);
		this.setDisabled(this._submit, value.length > 0);
	}

	set orderContact(value: IOrderContact) {
		if ('email' in value) this._email.value = value.email;
		if ('phone' in value) this._phone.value = value.phone;
	}
}
