import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDelivery } from 'app/shared/model/delivery.model';
import { DeliveryService } from './delivery.service';
import { DeliveryDeleteDialogComponent } from './delivery-delete-dialog.component';

@Component({
  selector: 'jhi-delivery',
  templateUrl: './delivery.component.html',
})
export class DeliveryComponent implements OnInit, OnDestroy {
  deliveries?: IDelivery[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected deliveryService: DeliveryService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.deliveryService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IDelivery[]>) => (this.deliveries = res.body || []));
      return;
    }

    this.deliveryService.query().subscribe((res: HttpResponse<IDelivery[]>) => (this.deliveries = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInDeliveries();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IDelivery): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInDeliveries(): void {
    this.eventSubscriber = this.eventManager.subscribe('deliveryListModification', () => this.loadAll());
  }

  delete(delivery: IDelivery): void {
    const modalRef = this.modalService.open(DeliveryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.delivery = delivery;
  }
}
