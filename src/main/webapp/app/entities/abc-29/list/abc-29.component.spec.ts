import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc29Service } from '../service/abc-29.service';

import { Abc29Component } from './abc-29.component';

describe('Abc29 Management Component', () => {
  let comp: Abc29Component;
  let fixture: ComponentFixture<Abc29Component>;
  let service: Abc29Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc29Component],
    })
      .overrideTemplate(Abc29Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc29Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc29Service);

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
    expect(comp.abc29s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
