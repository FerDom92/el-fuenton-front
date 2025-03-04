import { BaseEntity } from './entity.types';

export interface Product extends BaseEntity {
  name: string;
  price: number;
  detail: string;
}

export type ProductDTO = Omit<Product, 'id'> & Partial<BaseEntity>;

export interface ProductSaleByDate {
  date: Date;
  totalQuantity: number;
  topProduct: TopProduct;
}

interface TopProduct {
  productId: number;
  name: Name;
  quantity: number;
}

enum Name {
  ErgonomicCottonShoes = "Ergonomic Cotton Shoes",
  SmallPlasticTowels = "Small Plastic Towels",
  SmallSteelChair = "Small Steel Chair",
}