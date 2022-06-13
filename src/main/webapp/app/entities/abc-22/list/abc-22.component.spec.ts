import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc22Service } from '../service/abc-22.service';

import { Abc22Component } from './abc-22.component';

describe('Abc22 Management Component', () => {
  let comp: Abc22Component;
  let fixture: ComponentFixture<Abc22Component>;
  let service: Abc22Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc22Component],
    })
      .overrideTemplate(Abc22Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc22Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc22Service);

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
    expect(comp.abc22s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
