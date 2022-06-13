import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc19DetailComponent } from './abc-19-detail.component';

describe('Abc19 Management Detail Component', () => {
  let comp: Abc19DetailComponent;
  let fixture: ComponentFixture<Abc19DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc19DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc19: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc19DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc19DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc19 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc19).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
