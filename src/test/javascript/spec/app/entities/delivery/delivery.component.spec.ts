import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SparePartsDistributorTestModule } from '../../../test.module';
import { DeliveryComponent } from 'app/entities/delivery/delivery.component';
import { DeliveryService } from 'app/entities/delivery/delivery.service';
import { Delivery } from 'app/shared/model/delivery.model';

describe('Component Tests', () => {
  describe('Delivery Management Component', () => {
    let comp: DeliveryComponent;
    let fixture: ComponentFixture<DeliveryComponent>;
    let service: DeliveryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SparePartsDistributorTestModule],
        declarations: [DeliveryComponent],
      })
        .overrideTemplate(DeliveryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DeliveryComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DeliveryService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Delivery(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.deliveries && comp.deliveries[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
