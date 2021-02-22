import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SparePartsDistributorSharedModule } from 'app/shared/shared.module';
import { SparePartComponent } from './spare-part.component';
import { SparePartDetailComponent } from './spare-part-detail.component';
import { SparePartUpdateComponent } from './spare-part-update.component';
import { SparePartDeleteDialogComponent } from './spare-part-delete-dialog.component';
import { sparePartRoute } from './spare-part.route';

@NgModule({
  imports: [SparePartsDistributorSharedModule, RouterModule.forChild(sparePartRoute)],
  declarations: [SparePartComponent, SparePartDetailComponent, SparePartUpdateComponent, SparePartDeleteDialogComponent],
  entryComponents: [SparePartDeleteDialogComponent],
})
export class SparePartsDistributorSparePartModule {}
