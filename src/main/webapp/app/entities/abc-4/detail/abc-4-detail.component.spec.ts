import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc4DetailComponent } from './abc-4-detail.component';

describe('Abc4 Management Detail Component', () => {
  let comp: Abc4DetailComponent;
  let fixture: ComponentFixture<Abc4DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc4DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc4: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc4DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc4DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc4 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc4).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
