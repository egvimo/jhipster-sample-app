import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JoinTableDetailComponent } from './join-table-detail.component';

describe('Component Tests', () => {
  describe('JoinTable Management Detail Component', () => {
    let comp: JoinTableDetailComponent;
    let fixture: ComponentFixture<JoinTableDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JoinTableDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ joinTable: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(JoinTableDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JoinTableDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load joinTable on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.joinTable).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
