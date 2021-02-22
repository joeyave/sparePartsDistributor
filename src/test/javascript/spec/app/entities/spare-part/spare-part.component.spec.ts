import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SparePartsDistributorTestModule } from '../../../test.module';
import { SparePartComponent } from 'app/entities/spare-part/spare-part.component';
import { SparePartService } from 'app/entities/spare-part/spare-part.service';
import { SparePart } from 'app/shared/model/spare-part.model';

describe('Component Tests', () => {
  describe('SparePart Management Component', () => {
    let comp: SparePartComponent;
    let fixture: ComponentFixture<SparePartComponent>;
    let service: SparePartService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SparePartsDistributorTestModule],
        declarations: [SparePartComponent],
      })
        .overrideTemplate(SparePartComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SparePartComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SparePartService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new SparePart(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.spareParts && comp.spareParts[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
