import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs'

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false
  loadingSubs: Subscription

  constructor(private authService: AuthService, private uiService: UIService) { }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.LoadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading
    })
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe()
  }

  onSubmit(form: NgForm) {
    this.authService.login({...form.value})
  }

}
