import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc1DetailComponent } from './abc-1-detail.component';

describe('Abc1 Management Detail Component', () => {
  let comp: Abc1DetailComponent;
  let fixture: ComponentFixture<Abc1DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc1DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc1: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc1DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc1DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc1 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc1).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
