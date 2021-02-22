import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IProvider, Provider } from 'app/shared/model/provider.model';
import { ProviderService } from './provider.service';
import { ProviderComponent } from './provider.component';
import { ProviderDetailComponent } from './provider-detail.component';
import { ProviderUpdateComponent } from './provider-update.component';

@Injectable({ providedIn: 'root' })
export class ProviderResolve implements Resolve<IProvider> {
  constructor(private service: ProviderService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProvider> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((provider: HttpResponse<Provider>) => {
          if (provider.body) {
            return of(provider.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Provider());
  }
}

export const providerRoute: Routes = [
  {
    path: '',
    component: ProviderComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Providers',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProviderDetailComponent,
    resolve: {
      provider: ProviderResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Providers',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProviderUpdateComponent,
    resolve: {
      provider: ProviderResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Providers',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProviderUpdateComponent,
    resolve: {
      provider: ProviderResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Providers',
    },
    canActivate: [UserRouteAccessService],
  },
];
