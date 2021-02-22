import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDelivery, Delivery } from 'app/shared/model/delivery.model';
import { DeliveryService } from './delivery.service';
import { IProvider } from 'app/shared/model/provider.model';
import { ProviderService } from 'app/entities/provider/provider.service';
import { ISparePart } from 'app/shared/model/spare-part.model';
import { SparePartService } from 'app/entities/spare-part/spare-part.service';

type SelectableEntity = IProvider | ISparePart;

@Component({
  selector: 'jhi-delivery-update',
  templateUrl: './delivery-update.component.html',
})
export class DeliveryUpdateComponent implements OnInit {
  isSaving = false;
  providers: IProvider[] = [];
  spareparts: ISparePart[] = [];
  dateDp: any;

  editForm = this.fb.group({
    id: [],
    number: [],
    date: [],
    provider: [],
    sparePart: [],
  });

  constructor(
    protected deliveryService: DeliveryService,
    protected providerService: ProviderService,
    protected sparePartService: SparePartService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ delivery }) => {
      this.updateForm(delivery);

      this.providerService
        .query({ filter: 'delivery-is-null' })
        .pipe(
          map((res: HttpResponse<IProvider[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IProvider[]) => {
          if (!delivery.provider || !delivery.provider.id) {
            this.providers = resBody;
          } else {
            this.providerService
              .find(delivery.provider.id)
              .pipe(
                map((subRes: HttpResponse<IProvider>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IProvider[]) => (this.providers = concatRes));
          }
        });

      this.sparePartService
        .query({ filter: 'delivery-is-null' })
        .pipe(
          map((res: HttpResponse<ISparePart[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: ISparePart[]) => {
          if (!delivery.sparePart || !delivery.sparePart.id) {
            this.spareparts = resBody;
          } else {
            this.sparePartService
              .find(delivery.sparePart.id)
              .pipe(
                map((subRes: HttpResponse<ISparePart>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: ISparePart[]) => (this.spareparts = concatRes));
          }
        });
    });
  }

  updateForm(delivery: IDelivery): void {
    this.editForm.patchValue({
      id: delivery.id,
      number: delivery.number,
      date: delivery.date,
      provider: delivery.provider,
      sparePart: delivery.sparePart,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const delivery = this.createFromForm();
    if (delivery.id !== undefined) {
      this.subscribeToSaveResponse(this.deliveryService.update(delivery));
    } else {
      this.subscribeToSaveResponse(this.deliveryService.create(delivery));
    }
  }

  private createFromForm(): IDelivery {
    return {
      ...new Delivery(),
      id: this.editForm.get(['id'])!.value,
      number: this.editForm.get(['number'])!.value,
      date: this.editForm.get(['date'])!.value,
      provider: this.editForm.get(['provider'])!.value,
      sparePart: this.editForm.get(['sparePart'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDelivery>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
