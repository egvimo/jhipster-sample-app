import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc11DetailComponent } from './abc-11-detail.component';

describe('Abc11 Management Detail Component', () => {
  let comp: Abc11DetailComponent;
  let fixture: ComponentFixture<Abc11DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc11DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc11: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc11DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc11DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc11 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc11).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
