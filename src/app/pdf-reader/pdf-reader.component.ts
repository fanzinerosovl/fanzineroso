import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

@Component({
  selector: 'app-pdf-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-reader.component.html',
  styleUrls: ['./pdf-reader.component.scss']
})
export class PdfReaderComponent implements OnInit {
  currentPage = signal(1);
  totalPages = signal(0);
  isLoading = signal(true);
  isRenderingPage = signal(false);
  canvasDataUrl = signal('');
  zoomLevel = signal(100);
  currentVolume = signal('');
  
  private pdfDocument: any = null;
  private baseScale = 1.5;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const volume = params.get('volume');
      if (volume) {
        this.currentVolume.set(volume);
        const pdfPath = `/fanzines/Fanzineroso_${volume}.pdf`;
        this.loadPDF(pdfPath);
      }
    });
  }

  async loadPDF(url: string): Promise<void> {
    try {
      this.isLoading.set(true);
      const loadingTask = pdfjsLib.getDocument(url);
      this.pdfDocument = await loadingTask.promise;
      this.totalPages.set(this.pdfDocument.numPages);
      
      await this.renderPage(1);
      this.isLoading.set(false);
    } catch (error) {
      console.error('Error loading PDF:', error);
      this.isLoading.set(false);
    }
  }

  async renderPage(pageNumber: number): Promise<void> {
    if (!this.pdfDocument || pageNumber < 1 || pageNumber > this.pdfDocument.numPages) {
      return;
    }

    try {
      this.isRenderingPage.set(true);
      const page = await this.pdfDocument.getPage(pageNumber);
      const scale = this.baseScale * (this.zoomLevel() / 100);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        this.canvasDataUrl.set(canvas.toDataURL());
      }
      this.isRenderingPage.set(false);
    } catch (error) {
      console.error(`Error rendering page ${pageNumber}:`, error);
      this.isRenderingPage.set(false);
    }
  }

  async nextPage(): Promise<void> {
    const next = this.currentPage() + 1;
    if (next <= this.totalPages()) {
      this.currentPage.set(next);
      await this.renderPage(next);
    }
  }

  async previousPage(): Promise<void> {
    const prev = this.currentPage() - 1;
    if (prev >= 1) {
      this.currentPage.set(prev);
      await this.renderPage(prev);
    }
  }

  canGoPrevious(): boolean {
    return this.currentPage() > 1;
  }

  canGoNext(): boolean {
    return this.currentPage() < this.totalPages();
  }

  async zoomIn(): Promise<void> {
    const newZoom = Math.min(this.zoomLevel() + 25, 300);
    this.zoomLevel.set(newZoom);
    await this.renderPage(this.currentPage());
  }

  async zoomOut(): Promise<void> {
    const newZoom = Math.max(this.zoomLevel() - 25, 25);
    this.zoomLevel.set(newZoom);
    await this.renderPage(this.currentPage());
  }

  async resetZoom(): Promise<void> {
    this.zoomLevel.set(100);
    await this.renderPage(this.currentPage());
  }

  downloadPDF() {
    if (this.currentVolume()) {
      const link = document.createElement('a');
      link.href = `/fanzines/Fanzineroso_${this.currentVolume()}.pdf`;
      link.download = `Fanzineroso_${this.currentVolume()}.pdf`;
      link.click();
    }
  }
}
