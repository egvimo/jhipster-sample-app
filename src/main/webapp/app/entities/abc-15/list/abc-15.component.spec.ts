import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc15Service } from '../service/abc-15.service';

import { Abc15Component } from './abc-15.component';

describe('Abc15 Management Component', () => {
  let comp: Abc15Component;
  let fixture: ComponentFixture<Abc15Component>;
  let service: Abc15Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc15Component],
    })
      .overrideTemplate(Abc15Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc15Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc15Service);

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
    expect(comp.abc15s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
