import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc } from '../abc.model';

import { AbcDetailComponent } from './abc-detail.component';

describe('Component Tests', () => {
  describe('Abc Management Detail Component', () => {
    let comp: AbcDetailComponent;
    let fixture: ComponentFixture<AbcDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AbcDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ abc: new Abc(123) }) },
          },
        ],
      })
        .overrideTemplate(AbcDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AbcDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load abc on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.abc).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
