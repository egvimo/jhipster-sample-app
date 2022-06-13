import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc13DetailComponent } from './abc-13-detail.component';

describe('Abc13 Management Detail Component', () => {
  let comp: Abc13DetailComponent;
  let fixture: ComponentFixture<Abc13DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc13DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc13: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc13DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc13DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc13 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc13).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
