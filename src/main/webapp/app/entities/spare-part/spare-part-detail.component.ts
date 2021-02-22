import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISparePart } from 'app/shared/model/spare-part.model';

@Component({
  selector: 'jhi-spare-part-detail',
  templateUrl: './spare-part-detail.component.html',
})
export class SparePartDetailComponent implements OnInit {
  sparePart: ISparePart | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sparePart }) => (this.sparePart = sparePart));
  }

  previousState(): void {
    window.history.back();
  }
}
