import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksSummaryComponent } from './books-summary.component';

describe('BooksSummaryComponent', () => {
  let component: BooksSummaryComponent;
  let fixture: ComponentFixture<BooksSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
