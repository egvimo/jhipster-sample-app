import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc24DetailComponent } from './abc-24-detail.component';

describe('Abc24 Management Detail Component', () => {
  let comp: Abc24DetailComponent;
  let fixture: ComponentFixture<Abc24DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc24DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc24: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc24DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc24DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc24 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc24).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
