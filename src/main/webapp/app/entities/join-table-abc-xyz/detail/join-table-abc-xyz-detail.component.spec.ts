import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JoinTableAbcXyzDetailComponent } from './join-table-abc-xyz-detail.component';

describe('Component Tests', () => {
  describe('JoinTableAbcXyz Management Detail Component', () => {
    let comp: JoinTableAbcXyzDetailComponent;
    let fixture: ComponentFixture<JoinTableAbcXyzDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JoinTableAbcXyzDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ joinTableAbcXyz: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(JoinTableAbcXyzDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JoinTableAbcXyzDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load joinTableAbcXyz on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.joinTableAbcXyz).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
