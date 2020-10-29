import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'

import { AuthData } from "./auth-data.model";
import { TrainingService } from '../training/training.service';



@Injectable()
export class AuthService {
    private isAuthenticated = false
    authChange = new Subject<boolean>()

    constructor(private router:Router,
         private afAuth: AngularFireAuth,
         private trainingService: TrainingService
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
        this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
        })
        .catch(er => console.log(er))
       
    }

    login(authData: AuthData) {
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
        })
        .catch(er => console.log(er))
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