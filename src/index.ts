import './scss/styles.scss';

import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { FormOrderInfo, FormOrderContact } from './components/Forms';
import { Success } from './components/Success';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import {
	ProductListModel,
	BasketModel,
	OrderModel,
} from './components/WebLarekModel';
import { CardCatalog, CardPreview, CardBasket } from './components/Cards';
import { IOrderInfo, ProductId, IOrderContact } from './types';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;

const contactTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;

// Модели данных
const productListModel = new ProductListModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formOrderInfo = new FormOrderInfo(cloneTemplate(orderTemplate), events);
const formOrderContact = new FormOrderContact(
	cloneTemplate(contactTemplate),
	events
);
const success = new Success(cloneTemplate(successTemplate), events);

api
	.getProductList()
	.then((data) => {
		productListModel.setItems(data);
		console.log(productListModel);
	})
	.catch((err) => console.log(err));

// Изменились элементы списка товаров
events.on('items:change', () => {
	const itemsHTMLArray = productListModel
		.getItems()
		.map((item) =>
			new CardCatalog(cloneTemplate(cardCatalogTemplate), events).render(item)
		);
	page.render({
		gallery: itemsHTMLArray,
		counter: basketModel.getTotal(),
	});
});

// Выбран товар из списка
events.on('item:select', ({ id }: { id: ProductId }) => {
	modal.render({
		content: cardPreview.render(productListModel.getItem(id)),
	});
});

//Добавлен товар в корзину
events.on('item:addbasket', ({ id }: { id: ProductId }) => {
	basketModel.add(id);
	modal.close();
});

//Удален товар из корзины
events.on('item:deletebasket', ({ id }: { id: ProductId }) => {
	basketModel.remove(id);
	events.emit('basket:open');
});

//Открытие корзины
events.on('basket:open', () => {
	const itemsHTMLArray = Array.from(basketModel.items.keys()).map(
		(id, indx) => {
			const cardBasket = new CardBasket(
				cloneTemplate(cardBasketTemplate),
				events
			);
			cardBasket.index = indx + 1;
			return cardBasket.render(productListModel.getItem(id));
		}
	);

	modal.render({
		content: basket.render({
			basketItems: itemsHTMLArray,
			totalPrice: productListModel.getTotalPrice(
				Array.from(basketModel.items.keys())
			),
		}),
	});
});

//Изменилось содержимое корзины
events.on('basket:change', ({ items }: { items: ProductId[] }) => {
	page.render({
		counter: basketModel.getTotal(),
	});
});

// Оформления покупки, открытие формы для заполнения условии оплаты заказа
events.on('basket:order', () => {
	modal.close();
	orderModel.setOrderInfo({ payment: null, address: '' });
	modal.render({ content: formOrderInfo.render() });
});

//Изменились поля условии оплаты заказа
events.on(
	'orderInfo:change',
	(orderInfo: Partial<IOrderInfo> & { errors: string[] }) => {
		formOrderInfo.render(orderInfo);
	}
);

//Изменились значения элементов формы условии оплаты заказа
events.on('formOrderInfo:change', (orderInfo: Partial<IOrderInfo>) => {
	orderModel.setOrderInfo(orderInfo);
});

//Заверщение заполнения формы условии оплаты заказа
events.on('formOrderInfo:submit', () => {
	modal.close();
	orderModel.setOrderContact({ email: '', phone: '' });
	modal.render({ content: formOrderContact.render() });
});

//Изменились поля контакта заказа
events.on(
	'orderContact:change',
	(orderContact: Partial<IOrderContact> & { errors: string[] }) => {
		formOrderContact.render(orderContact);
	}
);

//Изменились значения элементов формы контакта заказа
events.on('formOrderContact:change', (orderContact: Partial<IOrderContact>) => {
	orderModel.setOrderContact(orderContact);
});

//Заверщение офрмления заказа,  отправка заказа на сервер
events.on('formOrderContact:submit', () => {
	api
		.postOrder({
			...orderModel.getOrderInfo(),
			...orderModel.getOrderContact(),
			total: productListModel.getTotalPrice(
				Array.from(basketModel.items.keys())
			),
			items: Array.from(basketModel.items.keys()),
		})
		.then((data) => {
			if ('error' in data) {
				alert(data.error);
			} else {
				modal.close();
				modal.render({
					content: success.render({
						totalPrice: productListModel.getTotalPrice(
							Array.from(basketModel.items.keys())
						),
					}),
				});
			}
		})
		.catch((err) => console.log(err));
});

//Заказ отправлен на сервер, очищаем корзину
events.on('success:close', () => {
	modal.close();
	basketModel.clear();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});
