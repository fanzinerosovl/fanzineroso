import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import volumenes from '../volumenes.json';
import { DownloadService } from '../services/download.service';

interface Volume {
  volume: string;
  year: string;
  months: string[];
  keywords: string[];
}

interface VolumesByYear {
  year: string;
  volumes: Volume[];
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  volumenesByYear: VolumesByYear[] = [];
  selectedVolume: string | null = null;
  menuPosition = { x: 0, y: 0 };

  constructor(
    private router: Router,
    private downloadService: DownloadService
  ) {}

  ngOnInit() {
    this.groupVolumesByYear();
  }

  groupVolumesByYear() {
    const grouped = new Map<string, Volume[]>();

    // Group volumes by year
    volumenes.forEach((volume: Volume) => {
      if (!grouped.has(volume.year)) {
        grouped.set(volume.year, []);
      }
      grouped.get(volume.year)?.push(volume);
    });

    // Convert to array and sort by year (descending)
    this.volumenesByYear = Array.from(grouped.entries())
      .map(([year, volumes]) => ({
        year,
        volumes: volumes.sort((a, b) => parseInt(b.volume) - parseInt(a.volume))
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }

  getImagePath(volume: string): string {
    return `portadas/${volume}.png`;
  }

  onImageClick(event: MouseEvent, volume: string) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedVolume = volume;
    this.menuPosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  closeMenu() {
    this.selectedVolume = null;
  }

  downloadDigital() {
    if (this.selectedVolume) {
      this.downloadService.downloadDigital(this.selectedVolume);
      this.closeMenu();
    }
  }

  downloadPrint() {
    if (this.selectedVolume) {
      this.downloadService.downloadPrint(this.selectedVolume);
      this.closeMenu();
    }
  }

  readFanzine() {
    if (this.selectedVolume) {
      this.router.navigate(['/lector', this.selectedVolume]);
      this.closeMenu();
    }
  }

  copyDownloadUrl() {
    if (this.selectedVolume) {
      const url = this.downloadService.getDownloadUrl(this.selectedVolume);
      navigator.clipboard.writeText(url).then(() => {
        alert('URL copiada al portapapeles');
      }).catch(() => {
        alert('Error al copiar la URL');
      });
      this.closeMenu();
    }
  }
}
