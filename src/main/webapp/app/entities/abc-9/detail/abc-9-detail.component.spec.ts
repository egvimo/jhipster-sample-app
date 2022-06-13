import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc9DetailComponent } from './abc-9-detail.component';

describe('Abc9 Management Detail Component', () => {
  let comp: Abc9DetailComponent;
  let fixture: ComponentFixture<Abc9DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc9DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc9: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc9DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc9DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc9 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc9).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
