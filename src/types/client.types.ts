import { BaseEntity } from './entity.types';

export interface Client extends BaseEntity {
  name: string;
  lastName: string;
  email: string;
}

export type ClientDTO = Omit<Client, 'id'> & Partial<BaseEntity>;

