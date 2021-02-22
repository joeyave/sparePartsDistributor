import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISparePart, SparePart } from 'app/shared/model/spare-part.model';
import { SparePartService } from './spare-part.service';
import { SparePartComponent } from './spare-part.component';
import { SparePartDetailComponent } from './spare-part-detail.component';
import { SparePartUpdateComponent } from './spare-part-update.component';

@Injectable({ providedIn: 'root' })
export class SparePartResolve implements Resolve<ISparePart> {
  constructor(private service: SparePartService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISparePart> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((sparePart: HttpResponse<SparePart>) => {
          if (sparePart.body) {
            return of(sparePart.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SparePart());
  }
}

export const sparePartRoute: Routes = [
  {
    path: '',
    component: SparePartComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SpareParts',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SparePartDetailComponent,
    resolve: {
      sparePart: SparePartResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SpareParts',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SparePartUpdateComponent,
    resolve: {
      sparePart: SparePartResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SpareParts',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SparePartUpdateComponent,
    resolve: {
      sparePart: SparePartResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SpareParts',
    },
    canActivate: [UserRouteAccessService],
  },
];
