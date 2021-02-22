import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProvider } from 'app/shared/model/provider.model';
import { ProviderService } from './provider.service';

@Component({
  templateUrl: './provider-delete-dialog.component.html',
})
export class ProviderDeleteDialogComponent {
  provider?: IProvider;

  constructor(protected providerService: ProviderService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.providerService.delete(id).subscribe(() => {
      this.eventManager.broadcast('providerListModification');
      this.activeModal.close();
    });
  }
}
