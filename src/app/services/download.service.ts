import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  /**
   * Downloads the digital version of a fanzine
   * @param volume The volume identifier (e.g., "1", "2", etc.)
   */
  downloadDigital(volume: string): void {
    const link = document.createElement('a');
    const pdfUrl = new URL(`fanzines/Fanzineroso_${volume}.pdf`, document.baseURI);
    link.href = pdfUrl.toString();
    link.download = `Fanzineroso_${volume}-digital.pdf`;
    link.click();
  }

  /**
   * Downloads the print version of a fanzine
   * @param volume The volume identifier (e.g., "1", "2", etc.)
   */
  downloadPrint(volume: string): void {
    const link = document.createElement('a');
    const pdfUrl = new URL(`impresion/Fanzineroso_${volume}.pdf`, document.baseURI);
    link.href = pdfUrl.toString();
    link.download = `Fanzineroso_${volume}-print.pdf`;
    link.click();
  }

  /**
   * Gets the full URL for downloading a fanzine
   * @param volume The volume identifier (e.g., "1", "2", etc.)
   * @returns The full URL to the digital version of the fanzine
   */
  getDownloadUrl(volume: string): string {
    return new URL(`fanzines/Fanzineroso_${volume}.pdf`, document.baseURI).toString();
  }
}
