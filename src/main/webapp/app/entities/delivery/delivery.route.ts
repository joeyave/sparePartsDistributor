import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IDelivery, Delivery } from 'app/shared/model/delivery.model';
import { DeliveryService } from './delivery.service';
import { DeliveryComponent } from './delivery.component';
import { DeliveryDetailComponent } from './delivery-detail.component';
import { DeliveryUpdateComponent } from './delivery-update.component';

@Injectable({ providedIn: 'root' })
export class DeliveryResolve implements Resolve<IDelivery> {
  constructor(private service: DeliveryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDelivery> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((delivery: HttpResponse<Delivery>) => {
          if (delivery.body) {
            return of(delivery.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Delivery());
  }
}

export const deliveryRoute: Routes = [
  {
    path: '',
    component: DeliveryComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Deliveries',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DeliveryDetailComponent,
    resolve: {
      delivery: DeliveryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Deliveries',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DeliveryUpdateComponent,
    resolve: {
      delivery: DeliveryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Deliveries',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DeliveryUpdateComponent,
    resolve: {
      delivery: DeliveryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Deliveries',
    },
    canActivate: [UserRouteAccessService],
  },
];
