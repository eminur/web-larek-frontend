import {Component} from "./base/component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";
import { PriceCurrency } from "../types";

interface IBasket {
    totalPrice: number;
    basketItems: HTMLElement[];
}

export class Basket extends Component<IBasket> {
    protected _basketPrice: HTMLElement;
    protected _basketItems: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._basketPrice = ensureElement('.basket__price',this.container);
        this._basketItems = ensureElement('.basket__list',this.container);
        this._button = ensureElement('.basket__button',this.container);

        this._button.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set totalPrice(value: number) {

        this.setText(this._basketPrice, String(value)+' '+PriceCurrency.SYNAPSESS);
    }

    set basketItems(items: HTMLElement[]) {
        this._basketItems.replaceChildren(...items);
        this.setDisabled(this._button,!items.length);
    }
}