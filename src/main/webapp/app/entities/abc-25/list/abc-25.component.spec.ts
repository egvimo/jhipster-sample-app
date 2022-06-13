import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc25Service } from '../service/abc-25.service';

import { Abc25Component } from './abc-25.component';

describe('Abc25 Management Component', () => {
  let comp: Abc25Component;
  let fixture: ComponentFixture<Abc25Component>;
  let service: Abc25Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc25Component],
    })
      .overrideTemplate(Abc25Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc25Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc25Service);

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
    expect(comp.abc25s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
