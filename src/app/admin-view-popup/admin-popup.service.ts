import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdminViewPopupComponent } from './admin-view-popup.component';
import { HousingLocation } from '../housinglocation';

@Injectable({
  providedIn: 'root',
})
export class AdminPopupService {
  constructor(private matDialog: MatDialog) {}

  openPopup(location: HousingLocation) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '1200px';
    dialogConfig.height = '600px';
    dialogConfig.data = { ...location };
    this.matDialog.open(AdminViewPopupComponent, dialogConfig);
  }

  closePopup() {
    this.matDialog.closeAll();
  }
}
