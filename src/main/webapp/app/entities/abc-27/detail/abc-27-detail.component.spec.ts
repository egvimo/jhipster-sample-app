import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc27DetailComponent } from './abc-27-detail.component';

describe('Abc27 Management Detail Component', () => {
  let comp: Abc27DetailComponent;
  let fixture: ComponentFixture<Abc27DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc27DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc27: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc27DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc27DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc27 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc27).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
