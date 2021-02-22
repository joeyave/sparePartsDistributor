import { IDelivery } from 'app/shared/model/delivery.model';

export interface ISparePart {
  id?: number;
  name?: string;
  term?: string;
  price?: number;
  note?: string;
  delivery?: IDelivery;
}

export class SparePart implements ISparePart {
  constructor(
    public id?: number,
    public name?: string,
    public term?: string,
    public price?: number,
    public note?: string,
    public delivery?: IDelivery
  ) {}
}
