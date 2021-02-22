import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDelivery } from 'app/shared/model/delivery.model';
import { DeliveryService } from './delivery.service';

@Component({
  templateUrl: './delivery-delete-dialog.component.html',
})
export class DeliveryDeleteDialogComponent {
  delivery?: IDelivery;

  constructor(protected deliveryService: DeliveryService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.deliveryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('deliveryListModification');
      this.activeModal.close();
    });
  }
}
