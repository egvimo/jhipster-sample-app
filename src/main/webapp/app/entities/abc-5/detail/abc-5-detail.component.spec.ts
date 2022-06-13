import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc5DetailComponent } from './abc-5-detail.component';

describe('Abc5 Management Detail Component', () => {
  let comp: Abc5DetailComponent;
  let fixture: ComponentFixture<Abc5DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc5DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc5: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc5DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc5DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc5 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc5).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
