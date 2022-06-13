import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc26DetailComponent } from './abc-26-detail.component';

describe('Abc26 Management Detail Component', () => {
  let comp: Abc26DetailComponent;
  let fixture: ComponentFixture<Abc26DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc26DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc26: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc26DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc26DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc26 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc26).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
