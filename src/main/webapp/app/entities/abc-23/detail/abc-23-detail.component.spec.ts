import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc23DetailComponent } from './abc-23-detail.component';

describe('Abc23 Management Detail Component', () => {
  let comp: Abc23DetailComponent;
  let fixture: ComponentFixture<Abc23DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc23DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc23: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc23DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc23DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc23 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc23).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
