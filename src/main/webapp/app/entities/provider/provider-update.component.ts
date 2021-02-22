import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IProvider, Provider } from 'app/shared/model/provider.model';
import { ProviderService } from './provider.service';

@Component({
  selector: 'jhi-provider-update',
  templateUrl: './provider-update.component.html',
})
export class ProviderUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    address: [],
    phone: [],
  });

  constructor(protected providerService: ProviderService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ provider }) => {
      this.updateForm(provider);
    });
  }

  updateForm(provider: IProvider): void {
    this.editForm.patchValue({
      id: provider.id,
      name: provider.name,
      address: provider.address,
      phone: provider.phone,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const provider = this.createFromForm();
    if (provider.id !== undefined) {
      this.subscribeToSaveResponse(this.providerService.update(provider));
    } else {
      this.subscribeToSaveResponse(this.providerService.create(provider));
    }
  }

  private createFromForm(): IProvider {
    return {
      ...new Provider(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      address: this.editForm.get(['address'])!.value,
      phone: this.editForm.get(['phone'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProvider>>): void {
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
}
