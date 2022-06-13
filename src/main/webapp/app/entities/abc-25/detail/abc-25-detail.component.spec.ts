import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc25DetailComponent } from './abc-25-detail.component';

describe('Abc25 Management Detail Component', () => {
  let comp: Abc25DetailComponent;
  let fixture: ComponentFixture<Abc25DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc25DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc25: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc25DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc25DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc25 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc25).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
