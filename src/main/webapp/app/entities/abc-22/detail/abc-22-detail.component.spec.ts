import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc22DetailComponent } from './abc-22-detail.component';

describe('Abc22 Management Detail Component', () => {
  let comp: Abc22DetailComponent;
  let fixture: ComponentFixture<Abc22DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc22DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc22: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc22DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc22DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc22 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc22).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
