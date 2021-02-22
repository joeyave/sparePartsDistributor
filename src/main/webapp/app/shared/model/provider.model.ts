import { IDelivery } from 'app/shared/model/delivery.model';

export interface IProvider {
  id?: number;
  name?: string;
  address?: string;
  phone?: string;
  delivery?: IDelivery;
}

export class Provider implements IProvider {
  constructor(public id?: number, public name?: string, public address?: string, public phone?: string, public delivery?: IDelivery) {}
}
