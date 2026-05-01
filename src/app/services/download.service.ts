import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private getBasePath(): string {
    let path = window.location.pathname;

    if (!path.endsWith('/')) {
      const lastSegment = path.split('/').pop() ?? '';
      path = lastSegment.includes('.') ? path.replace(/\/[^/]*$/, '/') : `${path}/`;
    }

    return path;
  }

  private buildAssetUrl(relativePath: string): string {
    const normalizedPath = relativePath.replace(/^\/+/, '');
    return `${window.location.origin}${this.getBasePath()}${normalizedPath}`;
  }

  /**
   * Downloads the digital version of a fanzine
   * @param volume The volume identifier (e.g., "1", "2", etc.)
   */
  downloadDigital(volume: string): void {
    const link = document.createElement('a');
    link.href = this.buildAssetUrl(`fanzines/Fanzineroso_${volume}.pdf`);
    link.download = `Fanzineroso_${volume}-digital.pdf`;
    link.click();
  }

  /**
   * Downloads the print version of a fanzine
   * @param volume The volume identifier (e.g., "1", "2", etc.)
   */
  downloadPrint(volume: string): void {
    const link = document.createElement('a');
    link.href = this.buildAssetUrl(`impresion/Fanzineroso_${volume}.pdf`);
    link.download = `Fanzineroso_${volume}-print.pdf`;
    link.click();
  }

  /**
   * Gets the full URL for downloading a fanzine
   * @param volume The volume identifier (e.g., "1", "2", etc.)
   * @returns The full URL to the digital version of the fanzine
   */
  getDownloadUrl(volume: string): string {
    return this.buildAssetUrl(`fanzines/Fanzineroso_${volume}.pdf`);
  }
}
