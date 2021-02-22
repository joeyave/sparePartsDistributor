import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SparePartsDistributorTestModule } from '../../../test.module';
import { SparePartDetailComponent } from 'app/entities/spare-part/spare-part-detail.component';
import { SparePart } from 'app/shared/model/spare-part.model';

describe('Component Tests', () => {
  describe('SparePart Management Detail Component', () => {
    let comp: SparePartDetailComponent;
    let fixture: ComponentFixture<SparePartDetailComponent>;
    const route = ({ data: of({ sparePart: new SparePart(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SparePartsDistributorTestModule],
        declarations: [SparePartDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(SparePartDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SparePartDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sparePart on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sparePart).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
