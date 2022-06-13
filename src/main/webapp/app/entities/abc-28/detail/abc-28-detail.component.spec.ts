import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc28DetailComponent } from './abc-28-detail.component';

describe('Abc28 Management Detail Component', () => {
  let comp: Abc28DetailComponent;
  let fixture: ComponentFixture<Abc28DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc28DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc28: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc28DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc28DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc28 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc28).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
