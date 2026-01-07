import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import volumenes from '../volumenes.json';

interface Volume {
  volume: string;
  year: string;
  months: string[];
  keywords: string[];
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchText: string = '';
  allKeywords: string[] = [];
  selectedTags: Set<string> = new Set();
  filteredVolumes: Volume[] = [];
  selectedVolume: string | null = null;
  menuPosition = { x: 0, y: 0 };

  constructor(private router: Router) {}

  ngOnInit() {
    this.extractAllKeywords();
    this.filterVolumes();
  }

  extractAllKeywords() {
    const keywordSet = new Set<string>();
    volumenes.forEach((volume: Volume) => {
      volume.keywords.forEach(keyword => {
        keywordSet.add(keyword.toLowerCase());
      });
    });
    this.allKeywords = Array.from(keywordSet).sort();
  }

  filterVolumes() {
    this.filteredVolumes = volumenes.filter((volume: Volume) => {
      // Check if search text matches any keyword
      const matchesSearchText = !this.searchText || 
        volume.keywords.some(keyword => 
          keyword.toLowerCase().includes(this.searchText.toLowerCase())
        );

      // Check if any selected tag is present in volume keywords
      const matchesSelectedTags = this.selectedTags.size === 0 ||
        Array.from(this.selectedTags).some(tag =>
          volume.keywords.some(keyword => keyword.toLowerCase() === tag)
        );

      return matchesSearchText && matchesSelectedTags;
    });
  }

  onSearchChange() {
    this.filterVolumes();
  }

  toggleTag(tag: string) {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
    this.filterVolumes();
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags.has(tag);
  }

  clearFilters() {
    this.searchText = '';
    this.selectedTags.clear();
    this.filterVolumes();
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
      const link = document.createElement('a');
      link.href = `fanzines/${this.selectedVolume}.pdf`;
      link.download = `fanzine-${this.selectedVolume}-digital.pdf`;
      link.click();
      this.closeMenu();
    }
  }

  downloadPrint() {
    if (this.selectedVolume) {
      const link = document.createElement('a');
      link.href = `impresion/${this.selectedVolume}.pdf`;
      link.download = `fanzine-${this.selectedVolume}-impresion.pdf`;
      link.click();
      this.closeMenu();
    }
  }

  readFanzine() {
    if (this.selectedVolume) {
      this.router.navigate(['/lector', this.selectedVolume]);
      this.closeMenu();
    }
  }

  getMatchingKeywords(volume: Volume): string[] {
    if (this.selectedTags.size === 0 && !this.searchText) {
      return volume.keywords.slice(0, 5);
    }

    const matching = volume.keywords.filter(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      
      // Check if matches selected tags
      const matchesTag = this.selectedTags.has(lowerKeyword);
      
      // Check if matches search text
      const matchesSearch = this.searchText && 
        lowerKeyword.includes(this.searchText.toLowerCase());
      
      return matchesTag || matchesSearch;
    });

    return matching.length > 0 ? matching : volume.keywords.slice(0, 5);
  }
}
