import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc14DetailComponent } from './abc-14-detail.component';

describe('Abc14 Management Detail Component', () => {
  let comp: Abc14DetailComponent;
  let fixture: ComponentFixture<Abc14DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc14DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc14: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc14DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc14DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc14 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc14).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
