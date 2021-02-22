import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISparePart } from 'app/shared/model/spare-part.model';
import { SparePartService } from './spare-part.service';

@Component({
  templateUrl: './spare-part-delete-dialog.component.html',
})
export class SparePartDeleteDialogComponent {
  sparePart?: ISparePart;

  constructor(protected sparePartService: SparePartService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sparePartService.delete(id).subscribe(() => {
      this.eventManager.broadcast('sparePartListModification');
      this.activeModal.close();
    });
  }
}
