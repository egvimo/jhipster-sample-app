import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc17Service } from '../service/abc-17.service';

import { Abc17Component } from './abc-17.component';

describe('Abc17 Management Component', () => {
  let comp: Abc17Component;
  let fixture: ComponentFixture<Abc17Component>;
  let service: Abc17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc17Component],
    })
      .overrideTemplate(Abc17Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc17Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc17Service);

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
    expect(comp.abc17s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
