import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnuncioPage } from './create-anuncio-page';

describe('CreateAnuncioPage', () => {
  let component: CreateAnuncioPage;
  let fixture: ComponentFixture<CreateAnuncioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAnuncioPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAnuncioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
