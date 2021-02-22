import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'spare-part',
        loadChildren: () => import('./spare-part/spare-part.module').then(m => m.SparePartsDistributorSparePartModule),
      },
      {
        path: 'delivery',
        loadChildren: () => import('./delivery/delivery.module').then(m => m.SparePartsDistributorDeliveryModule),
      },
      {
        path: 'provider',
        loadChildren: () => import('./provider/provider.module').then(m => m.SparePartsDistributorProviderModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class SparePartsDistributorEntityModule {}
