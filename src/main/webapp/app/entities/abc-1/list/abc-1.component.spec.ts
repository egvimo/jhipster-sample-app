import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc1Service } from '../service/abc-1.service';

import { Abc1Component } from './abc-1.component';

describe('Abc1 Management Component', () => {
  let comp: Abc1Component;
  let fixture: ComponentFixture<Abc1Component>;
  let service: Abc1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc1Component],
    })
      .overrideTemplate(Abc1Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc1Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc1Service);

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
    expect(comp.abc1s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
