import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc0DetailComponent } from './abc-0-detail.component';

describe('Abc0 Management Detail Component', () => {
  let comp: Abc0DetailComponent;
  let fixture: ComponentFixture<Abc0DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc0DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc0: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc0DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc0DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc0 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc0).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
