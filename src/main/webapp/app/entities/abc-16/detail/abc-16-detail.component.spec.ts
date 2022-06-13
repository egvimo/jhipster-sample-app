import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc16DetailComponent } from './abc-16-detail.component';

describe('Abc16 Management Detail Component', () => {
  let comp: Abc16DetailComponent;
  let fixture: ComponentFixture<Abc16DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc16DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc16: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc16DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc16DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc16 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc16).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
