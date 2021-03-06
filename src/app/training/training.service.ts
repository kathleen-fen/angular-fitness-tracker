import { Subject } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs'

import { Exercise } from "./exercise.model";
import { UIService } from '../shared/ui.service';


@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>()
    exercisesChanged = new Subject<Exercise[]>()
    finishedExerisesChanged = new Subject<Exercise[]>()
    private availableExercises: Exercise[]
    private runningExercise: Exercise
    private fbSubs: Subscription[] = []

    constructor(private db:AngularFirestore, private uiService: UIService) {}

    fetchAvailableExercises() {
        this.fbSubs.push(this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
        map(docArray => {
        return docArray.map(doc => {
            const data: Object = doc.payload.doc.data()
            return {
            id: doc.payload.doc.id,
            ...data
            }
        })
        }))
        .subscribe((exercises: Exercise[]) => {
            this.availableExercises = exercises
            this.exercisesChanged.next([...this.availableExercises])
        }, error => {
            this.uiService.LoadingStateChanged.next(false)
            this.uiService.showSnackBar("Fetching of exercises is failed. Try again later.", null, 3000)
            this.exerciseChanged.next(null)
        }))
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId)
        this.exerciseChanged.next({...this.runningExercise})
    }

    completeExercise() {
        this.addDataToDatabase({
             ...this.runningExercise,
              date: new Date(),
              state: 'completed' 
            })
        this.runningExercise = null
        this.exerciseChanged.next(null)
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress/100),
            calories: this.runningExercise.calories * (progress/100),
            date: new Date(),
            state: 'canceled' 
           })
       this.runningExercise = null
       this.exerciseChanged.next(null)
    }

    getRunningExercise() {
        return {...this.runningExercise}
    }

    fetchCompletedOrCanceledExerceses() {
        this.fbSubs.push(this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
            this.finishedExerisesChanged.next(exercises)
        }))
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise)
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe())
    }
}