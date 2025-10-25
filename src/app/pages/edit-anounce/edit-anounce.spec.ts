import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAnounce } from './edit-anounce';

describe('EditAnounce', () => {
  let component: EditAnounce;
  let fixture: ComponentFixture<EditAnounce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAnounce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAnounce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
