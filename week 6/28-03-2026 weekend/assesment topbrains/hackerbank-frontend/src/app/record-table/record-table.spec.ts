import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordTable } from './record-table';

describe('RecordTable', () => {
  let component: RecordTable;
  let fixture: ComponentFixture<RecordTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordTable],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
