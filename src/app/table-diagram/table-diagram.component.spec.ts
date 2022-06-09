import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDiagramComponent } from './table-diagram.component';

describe('TableDiagramComponent', () => {
  let component: TableDiagramComponent;
  let fixture: ComponentFixture<TableDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
