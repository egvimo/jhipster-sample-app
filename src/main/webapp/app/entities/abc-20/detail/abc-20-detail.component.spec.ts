import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc20DetailComponent } from './abc-20-detail.component';

describe('Abc20 Management Detail Component', () => {
  let comp: Abc20DetailComponent;
  let fixture: ComponentFixture<Abc20DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc20DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc20: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc20DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc20DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc20 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc20).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
