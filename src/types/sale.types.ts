import { Client } from './client.types';
import { BaseEntity } from './entity.types';
import { Product } from './product.types';

export interface SaleItem {
  id?: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice?: number;
  total?: number;
}

export interface Sale extends BaseEntity {
  date: string;
  client: Client;
  clientId: number;
  items: SaleItem[];
  total: number;
}

export type SaleDTO = {
  clientId: number;  // Este campo es crucial
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  total?: number;
};