import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
})
export class MapDialogComponent {
  mapUrl: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<MapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public address: string,
    private sanitizer: DomSanitizer
  ) {
    const query = this.address?.trim()
      ? encodeURIComponent(this.address)
      : encodeURIComponent('Universidad Peruana de Ciencias Aplicadas, Lima, Perú');

    const url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyC97qpT647izyz5EdRB1xe6BWk1Bnw5LeA&q=${query}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  close(): void {
    this.dialogRef.close();
  }
}