import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  isAuth = false
  authSubsription: Subscription
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubsription = this.authService.authChange.subscribe(authStatus => this.isAuth=authStatus)
  }

  ngOnDestroy() {
    this.authSubsription.unsubscribe()
  }
  
  @Output() closeSidenav = new EventEmitter()

  onClose() {
    this.closeSidenav.emit()
  }

  onLogout() {
    this.authService.logout()
    this.onClose()
  }

}
