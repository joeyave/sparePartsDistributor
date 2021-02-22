import { Moment } from 'moment';
import { IProvider } from 'app/shared/model/provider.model';
import { ISparePart } from 'app/shared/model/spare-part.model';

export interface IDelivery {
  id?: number;
  number?: number;
  date?: Moment;
  provider?: IProvider;
  sparePart?: ISparePart;
}

export class Delivery implements IDelivery {
  constructor(
    public id?: number,
    public number?: number,
    public date?: Moment,
    public provider?: IProvider,
    public sparePart?: ISparePart
  ) {}
}
