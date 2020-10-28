import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { StopTraningComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingExit = new EventEmitter()
  progress = 0;
  timer: number;
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.startOrResumeTimer()
  }

  startOrResumeTimer() {
    this.timer = setInterval(() => {
      this.progress = this.progress + 1
      if (this.progress >= 100) {
        clearInterval(this.timer)
      }
    }, 100)
  }

  onStop() {
    clearInterval(this.timer)
    const dialogRef = this.dialog.open(StopTraningComponent, {data: {
      progress: this.progress
    }})
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingExit.emit()
      } else {
        this.startOrResumeTimer()
      }
    })
  }
}
