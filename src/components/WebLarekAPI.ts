import { Api, ApiListResponse } from './base/api';
import {ProductId, IProductItem, Order,IOrderResult} from "../types";

export interface IWebLarekAPI {
  getProductList: () => Promise<IProductItem[]>;
  getProductItem: (id: ProductId) => Promise<IProductItem>;
  postOrder: (order: Order) =>  Promise<IOrderResult>
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
  
  readonly cdn: string;
  
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }
  getProductList(): Promise<IProductItem[]> {
    return this.get('/product/').then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image
      }))
    );
  };

  getProductItem (id: ProductId): Promise<IProductItem>{
    return this.get(`/product/${id}`).then(
      (item: IProductItem) => ({
          ...item,
          image: this.cdn + item.image,
      })
     );
  }; 

  postOrder(order: Order): Promise<IOrderResult>{
    return this.post('/order', order).then(
      (data: IOrderResult) => data
    );
  }

}