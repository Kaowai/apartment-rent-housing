import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupCreateApartmentComponent } from './popup-create-apartment.component';

@Injectable({
  providedIn: 'root',
})
export class PopupCreateApartmentService {
  constructor(private dialog: MatDialog) {}

  openPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '1200px';
    dialogConfig.height = '600px';
    dialogConfig.data = { ...location };
    this.dialog.open(PopupCreateApartmentComponent, dialogConfig);
  }
  closePopup() {
    this.dialog.closeAll();
  }
}
