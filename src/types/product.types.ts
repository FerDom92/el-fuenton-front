import { BaseEntity } from './entity.types';

export interface Product extends BaseEntity {
  nombre: string;
  precio: number;
  detalle: string;
}

export type ProductDTO = Omit<Product, 'id'> & Partial<BaseEntity>;