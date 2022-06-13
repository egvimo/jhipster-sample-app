import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc6DetailComponent } from './abc-6-detail.component';

describe('Abc6 Management Detail Component', () => {
  let comp: Abc6DetailComponent;
  let fixture: ComponentFixture<Abc6DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc6DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc6: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc6DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc6DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc6 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc6).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
