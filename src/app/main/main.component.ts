import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from '../gallery';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, GalleryComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
}
