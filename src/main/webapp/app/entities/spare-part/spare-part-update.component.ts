import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ISparePart, SparePart } from 'app/shared/model/spare-part.model';
import { SparePartService } from './spare-part.service';

@Component({
  selector: 'jhi-spare-part-update',
  templateUrl: './spare-part-update.component.html',
})
export class SparePartUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    term: [],
    price: [],
    note: [],
  });

  constructor(protected sparePartService: SparePartService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sparePart }) => {
      this.updateForm(sparePart);
    });
  }

  updateForm(sparePart: ISparePart): void {
    this.editForm.patchValue({
      id: sparePart.id,
      name: sparePart.name,
      term: sparePart.term,
      price: sparePart.price,
      note: sparePart.note,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sparePart = this.createFromForm();
    if (sparePart.id !== undefined) {
      this.subscribeToSaveResponse(this.sparePartService.update(sparePart));
    } else {
      this.subscribeToSaveResponse(this.sparePartService.create(sparePart));
    }
  }

  private createFromForm(): ISparePart {
    return {
      ...new SparePart(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      term: this.editForm.get(['term'])!.value,
      price: this.editForm.get(['price'])!.value,
      note: this.editForm.get(['note'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISparePart>>): void {
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
