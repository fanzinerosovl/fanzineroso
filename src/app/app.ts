import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fanzineroso');

  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToSearch() {
    this.router.navigate(['/buscar']);
  }

  sendEmail() {
    window.location.href = 'mailto:fanzineroso@proton.me';
  }

  navigateToInstagram() {
    window.open('https://www.instagram.com/fanzineroso_vl/', '_blank');
  }

  navigateToBlogger() {
    window.open('https://fanzinerosovl.blogspot.com/', '_blank');
  }
}

