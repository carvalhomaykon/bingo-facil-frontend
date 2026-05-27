import { Component, EventEmitter, OnDestroy, OnInit, Output, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { authGuard } from '../../auth.guard';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit, OnDestroy {

  @Output("logout") submit = new EventEmitter();

  isFirstPage = false;
  isMenuOpen = false;
  username: string = '';
  isUserMenuOpen = false;

  private routerSubscription!: Subscription;

  @ViewChild('userMenuContainer') userMenuContainer!: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkCurrentRoute();
    this.getUsername();

    this.routerSubscription = this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.checkCurrentRoute();
      })
  }

  checkCurrentRoute(): void{
    const currentUrl = this.router.url.split(/[?#]/)[0];

    this.isFirstPage = currentUrl === '/' || currentUrl === '';
  }

  ngOnDestroy(): void {
    if (this.routerSubscription){
      this.routerSubscription.unsubscribe();
    }
  }

  getUsername(): void{
    this.authService.getUsername().subscribe({
      next: username => {
        this.username = username;
      }
    });
  }

  logout(){
    this.authService.logout();
    this.router.navigate(["/"])
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

}
