import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProvider } from 'app/shared/model/provider.model';
import { ProviderService } from './provider.service';
import { ProviderDeleteDialogComponent } from './provider-delete-dialog.component';

@Component({
  selector: 'jhi-provider',
  templateUrl: './provider.component.html',
})
export class ProviderComponent implements OnInit, OnDestroy {
  providers?: IProvider[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected providerService: ProviderService,
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
      this.providerService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IProvider[]>) => (this.providers = res.body || []));
      return;
    }

    this.providerService.query().subscribe((res: HttpResponse<IProvider[]>) => (this.providers = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInProviders();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IProvider): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInProviders(): void {
    this.eventSubscriber = this.eventManager.subscribe('providerListModification', () => this.loadAll());
  }

  delete(provider: IProvider): void {
    const modalRef = this.modalService.open(ProviderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.provider = provider;
  }
}
