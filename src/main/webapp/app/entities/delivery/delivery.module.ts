import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SparePartsDistributorSharedModule } from 'app/shared/shared.module';
import { DeliveryComponent } from './delivery.component';
import { DeliveryDetailComponent } from './delivery-detail.component';
import { DeliveryUpdateComponent } from './delivery-update.component';
import { DeliveryDeleteDialogComponent } from './delivery-delete-dialog.component';
import { deliveryRoute } from './delivery.route';

@NgModule({
  imports: [SparePartsDistributorSharedModule, RouterModule.forChild(deliveryRoute)],
  declarations: [DeliveryComponent, DeliveryDetailComponent, DeliveryUpdateComponent, DeliveryDeleteDialogComponent],
  entryComponents: [DeliveryDeleteDialogComponent],
})
export class SparePartsDistributorDeliveryModule {}
