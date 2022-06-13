import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc21DetailComponent } from './abc-21-detail.component';

describe('Abc21 Management Detail Component', () => {
  let comp: Abc21DetailComponent;
  let fixture: ComponentFixture<Abc21DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc21DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc21: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc21DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc21DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc21 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc21).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
