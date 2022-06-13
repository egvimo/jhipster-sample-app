import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc15DetailComponent } from './abc-15-detail.component';

describe('Abc15 Management Detail Component', () => {
  let comp: Abc15DetailComponent;
  let fixture: ComponentFixture<Abc15DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc15DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc15: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc15DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc15DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc15 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc15).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
