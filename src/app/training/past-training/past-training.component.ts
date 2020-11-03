import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator'
import { Subscription } from 'rxjs';


import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';



@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort:MatSort
  @ViewChild(MatPaginator) paginator: MatPaginator
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state']
  dataSource = new MatTableDataSource<Exercise>()
  private exChangedSubscription: Subscription;
  constructor(private trainingService: TrainingService, private matService: MatPaginatorIntl ) { }

  ngOnInit(): void {
    this.exChangedSubscription = this.trainingService.finishedExerisesChanged.subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises
    })
    this.trainingService.fetchCompletedOrCanceledExerceses()
  }
  
  ngAfterViewInit() {
    this.matService.changes.subscribe(() => {
      console.log('changes')
    })
    console.log('ngAfterOnInit')
    this.matService.nextPageLabel = 'Next!'
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    console.log('paginator',this.paginator)
    console.log('pagService', this.matService)
  }

  doFilter(filterValue:string) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  ngOnDestroy() {
    if (this.exChangedSubscription) {
      this.exChangedSubscription.unsubscribe()
    }
  }

}
