import { IOrderContact, IOrderInfo } from '../types';
import { IEvents } from './base/events';

export class OrderModel {
	protected _errors: string[];

	orderInfo: IOrderInfo={payment:null, address:''};
	orderContact: IOrderContact={email:'',phone:''};

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
