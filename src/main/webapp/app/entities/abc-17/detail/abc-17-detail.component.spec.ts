import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Abc17DetailComponent } from './abc-17-detail.component';

describe('Abc17 Management Detail Component', () => {
  let comp: Abc17DetailComponent;
  let fixture: ComponentFixture<Abc17DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Abc17DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ abc17: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Abc17DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Abc17DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load abc17 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.abc17).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
