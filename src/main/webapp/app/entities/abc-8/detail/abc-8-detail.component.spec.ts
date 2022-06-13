import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc8DetailComponent } from './abc-8-detail.component';

describe('Abc8 Management Detail Component', () => {
  let comp: Abc8DetailComponent;
  let fixture: ComponentFixture<Abc8DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc8DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc8: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc8DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc8DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc8 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc8).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
