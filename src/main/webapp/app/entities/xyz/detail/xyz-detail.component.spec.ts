import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { XyzDetailComponent } from './xyz-detail.component';

describe('Component Tests', () => {
  describe('Xyz Management Detail Component', () => {
    let comp: XyzDetailComponent;
    let fixture: ComponentFixture<XyzDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [XyzDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ xyz: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(XyzDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(XyzDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load xyz on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.xyz).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
