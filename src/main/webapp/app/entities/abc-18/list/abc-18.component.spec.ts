import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc18Service } from '../service/abc-18.service';

import { Abc18Component } from './abc-18.component';

describe('Abc18 Management Component', () => {
  let comp: Abc18Component;
  let fixture: ComponentFixture<Abc18Component>;
  let service: Abc18Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc18Component],
    })
      .overrideTemplate(Abc18Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc18Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc18Service);

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
    expect(comp.abc18s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
