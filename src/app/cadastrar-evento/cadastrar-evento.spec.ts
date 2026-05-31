import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarEvento } from './cadastrar-evento';

describe('CadastrarEvento', () => {
  let component: CadastrarEvento;
  let fixture: ComponentFixture<CadastrarEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarEvento],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarEvento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
