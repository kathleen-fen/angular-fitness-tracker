import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import {MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort:MatSort
  @ViewChild(MatPaginator) paginator: MatPaginator
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state']
  dataSource = new MatTableDataSource<Exercise>()
  constructor(private trainingService: TrainingService ) { }

  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getCompletedOrCanceledExerceses()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  doFilter(filterValue:string) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

}
