import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UIService } from '../shared/ui.service';

import { AuthData } from "./auth-data.model";
import { TrainingService } from '../training/training.service';



@Injectable()
export class AuthService {
    private isAuthenticated = false
    authChange = new Subject<boolean>()

    constructor(private router:Router,
         private afAuth: AngularFireAuth,
         private trainingService: TrainingService,
         private uiService: UIService
         ) {}

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true
                this.authChange.next(true)
                this.router.navigate(['/training'])
            } else {
                this.trainingService.cancelSubscriptions()
                this.authChange.next(false)
                this.router.navigate(['/login'])
                this.isAuthenticated = false
            }
        })
    }     

    registerUser(authData: AuthData) {
        this.uiService.LoadingStateChanged.next(true)
        this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            this.uiService.LoadingStateChanged.next(false)
        })
        .catch(er => {
            this.uiService.LoadingStateChanged.next(false)
            this.uiService.showSnackBar(er.message,null,3000)
        })
       
    }

    login(authData: AuthData) {
        this.uiService.LoadingStateChanged.next(true)
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            this.uiService.LoadingStateChanged.next(false)
        })
        .catch(er => {
            this.uiService.LoadingStateChanged.next(false)
            this.uiService.showSnackBar(er.message,null,3000)
        })
    }

    logout() {
        this.afAuth.signOut()
        
    }

    getUser() {
      //  return {...this.user}
    }

    isAuth() {
        return this.isAuthenticated
    }

    
}