import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUploadedBooksComponent } from './my-uploaded-books.component';

describe('MyUploadedBooksComponent', () => {
  let component: MyUploadedBooksComponent;
  let fixture: ComponentFixture<MyUploadedBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyUploadedBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyUploadedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
