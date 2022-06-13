import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc7DetailComponent } from './abc-7-detail.component';

describe('Abc7 Management Detail Component', () => {
  let comp: Abc7DetailComponent;
  let fixture: ComponentFixture<Abc7DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc7DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc7: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc7DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc7DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc7 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc7).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
