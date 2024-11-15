import { Component, Inject, inject, OnInit } from '@angular/core';
import { PopupService } from './popup.service';
import { FormRegister } from '../../form-register';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent implements OnInit {
  popupService = inject(PopupService);
  fromParentComponent!: FormRegister;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>
  ) {
    this.fromParentComponent = data;
  }
  close() {
    this.popupService.closePopup();
  }
  ngOnInit(): void {
    console.log(this.fromParentComponent);
  }
}
