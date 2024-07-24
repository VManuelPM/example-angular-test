import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerComponent } from './worker.component';
import {By} from "@angular/platform-browser";

describe('WorkerComponent', () => {
  let component: WorkerComponent;
  let fixture: ComponentFixture<WorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify that exists a span', () => {
      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('span')?.textContent).toContain("I am a span")
  });
});
