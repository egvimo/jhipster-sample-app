import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc3DetailComponent } from './abc-3-detail.component';

describe('Abc3 Management Detail Component', () => {
  let comp: Abc3DetailComponent;
  let fixture: ComponentFixture<Abc3DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc3DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc3: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc3DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc3DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc3 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc3).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
