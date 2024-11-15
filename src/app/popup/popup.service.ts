import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from './popup.component';
import { FormRegister } from '../../form-register';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  openPopup(formRegister: FormRegister) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '1024px';
    dialogConfig.height = '240px';
    dialogConfig.data = formRegister;
    dialogConfig.panelClass = 'mat-dialog-container';
    this.dialog.open(PopupComponent, dialogConfig);
  }

  closePopup() {
    this.dialog.closeAll();
  }
}
