import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc29DetailComponent } from './abc-29-detail.component';

describe('Abc29 Management Detail Component', () => {
  let comp: Abc29DetailComponent;
  let fixture: ComponentFixture<Abc29DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc29DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc29: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc29DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc29DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc29 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc29).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
