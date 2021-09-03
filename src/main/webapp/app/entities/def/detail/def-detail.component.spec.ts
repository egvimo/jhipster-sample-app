import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DefDetailComponent } from './def-detail.component';

describe('Component Tests', () => {
  describe('Def Management Detail Component', () => {
    let comp: DefDetailComponent;
    let fixture: ComponentFixture<DefDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DefDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ def: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DefDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DefDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load def on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.def).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
