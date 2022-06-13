import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc2DetailComponent } from './abc-2-detail.component';

describe('Abc2 Management Detail Component', () => {
  let comp: Abc2DetailComponent;
  let fixture: ComponentFixture<Abc2DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc2DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc2: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc2DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc2DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc2 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc2).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
