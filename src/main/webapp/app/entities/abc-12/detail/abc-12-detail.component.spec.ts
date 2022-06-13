import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc12DetailComponent } from './abc-12-detail.component';

describe('Abc12 Management Detail Component', () => {
  let comp: Abc12DetailComponent;
  let fixture: ComponentFixture<Abc12DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc12DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc12: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc12DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc12DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc12 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc12).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
