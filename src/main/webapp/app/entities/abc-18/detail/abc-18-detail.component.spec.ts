import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc18DetailComponent } from './abc-18-detail.component';

describe('Abc18 Management Detail Component', () => {
  let comp: Abc18DetailComponent;
  let fixture: ComponentFixture<Abc18DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc18DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc18: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc18DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc18DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc18 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc18).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
