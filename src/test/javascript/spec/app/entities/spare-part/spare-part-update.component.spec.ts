import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { SparePartsDistributorTestModule } from '../../../test.module';
import { SparePartUpdateComponent } from 'app/entities/spare-part/spare-part-update.component';
import { SparePartService } from 'app/entities/spare-part/spare-part.service';
import { SparePart } from 'app/shared/model/spare-part.model';

describe('Component Tests', () => {
  describe('SparePart Management Update Component', () => {
    let comp: SparePartUpdateComponent;
    let fixture: ComponentFixture<SparePartUpdateComponent>;
    let service: SparePartService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SparePartsDistributorTestModule],
        declarations: [SparePartUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(SparePartUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SparePartUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SparePartService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new SparePart(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new SparePart();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
