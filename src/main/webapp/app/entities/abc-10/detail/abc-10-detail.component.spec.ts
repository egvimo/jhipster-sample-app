import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc10DetailComponent } from './abc-10-detail.component';

describe('Abc10 Management Detail Component', () => {
  let comp: Abc10DetailComponent;
  let fixture: ComponentFixture<Abc10DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc10DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc10: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc10DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc10DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc10 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc10).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
