import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  private readonly MENU_WIDTH = 250;
  private readonly MENU_HEIGHT = 220;
  private readonly MENU_MARGIN = 12;

  volumenesByYear: VolumesByYear[] = [];
  selectedVolume: string | null = null;
  menuPosition = { x: 0, y: 0 };

  constructor(
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

    const maxX = window.innerWidth - this.MENU_WIDTH - this.MENU_MARGIN;
    const maxY = window.innerHeight - this.MENU_HEIGHT - this.MENU_MARGIN;

    this.selectedVolume = volume;
    this.menuPosition = {
      x: Math.max(this.MENU_MARGIN, Math.min(event.clientX, maxX)),
      y: Math.max(this.MENU_MARGIN, Math.min(event.clientY, maxY))
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
      window.open(`/fanzines/Fanzineroso_${this.selectedVolume}.pdf`, '_blank');
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
