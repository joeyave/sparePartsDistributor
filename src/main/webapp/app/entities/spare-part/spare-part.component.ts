import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISparePart } from 'app/shared/model/spare-part.model';
import { SparePartService } from './spare-part.service';
import { SparePartDeleteDialogComponent } from './spare-part-delete-dialog.component';

@Component({
  selector: 'jhi-spare-part',
  templateUrl: './spare-part.component.html',
})
export class SparePartComponent implements OnInit, OnDestroy {
  spareParts?: ISparePart[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected sparePartService: SparePartService,
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
      this.sparePartService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<ISparePart[]>) => (this.spareParts = res.body || []));
      return;
    }

    this.sparePartService.query().subscribe((res: HttpResponse<ISparePart[]>) => (this.spareParts = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInSpareParts();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ISparePart): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInSpareParts(): void {
    this.eventSubscriber = this.eventManager.subscribe('sparePartListModification', () => this.loadAll());
  }

  delete(sparePart: ISparePart): void {
    const modalRef = this.modalService.open(SparePartDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sparePart = sparePart;
  }
}
