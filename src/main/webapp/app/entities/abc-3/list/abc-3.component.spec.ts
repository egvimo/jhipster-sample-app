import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc3Service } from '../service/abc-3.service';

import { Abc3Component } from './abc-3.component';

describe('Abc3 Management Component', () => {
  let comp: Abc3Component;
  let fixture: ComponentFixture<Abc3Component>;
  let service: Abc3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc3Component],
    })
      .overrideTemplate(Abc3Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc3Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc3Service);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.abc3s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
