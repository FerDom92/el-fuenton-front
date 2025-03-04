import { BaseEntity } from './entity.types';

export interface Product extends BaseEntity {
  name: string;
  price: number;
  detail: string;
}

export type ProductDTO = Omit<Product, 'id'> & Partial<BaseEntity>;