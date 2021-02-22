import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { SparePartsDistributorTestModule } from '../../../test.module';
import { DeliveryUpdateComponent } from 'app/entities/delivery/delivery-update.component';
import { DeliveryService } from 'app/entities/delivery/delivery.service';
import { Delivery } from 'app/shared/model/delivery.model';

describe('Component Tests', () => {
  describe('Delivery Management Update Component', () => {
    let comp: DeliveryUpdateComponent;
    let fixture: ComponentFixture<DeliveryUpdateComponent>;
    let service: DeliveryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SparePartsDistributorTestModule],
        declarations: [DeliveryUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(DeliveryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DeliveryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DeliveryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Delivery(123);
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
        const entity = new Delivery();
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
