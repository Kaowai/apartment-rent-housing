import { HousingLocationComponent } from './../housing-location/housing-location.component';
import { Component, inject, OnInit } from '@angular/core';
import { HousingLocationAdminComponent } from '../housing-location-admin/housing-location-admin.component';
import { HousingLocation } from '../housinglocation';
import { Router } from '@angular/router';
import { HousingService } from '../housing.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminPopupService } from '../admin-view-popup/admin-popup.service';
import { BrowserModule } from '@angular/platform-browser';
import { PopupCreateApartmentService } from '../popup-create-apartment/popup-create-apartment.service';

@Component({
  selector: 'app-apartment-management',
  standalone: true,
  imports: [HousingLocationAdminComponent, CommonModule, MatDialogModule],
  templateUrl: './apartment-management.component.html',
  styleUrl: './apartment-management.component.scss',
})
export class ApartmentManagementComponent implements OnInit {
  housingLocationList: HousingLocation[] = [];
  housingService = inject(HousingService);
  adminPopup = inject(AdminPopupService);
  createApartmentPopup = inject(PopupCreateApartmentService);
  constructor(private route: Router) {}
  ngOnInit(): void {
    this.refreshFormRegisterList();
    this.housingService.dataUpdated$.subscribe((status) => {
      if (status) {
        this.refreshFormRegisterList();
      }
    });
  }

  refreshFormRegisterList() {
    this.housingService
      .getAllHousingLocations()
      .subscribe((housingLocationList) => {
        this.housingLocationList = housingLocationList;
      });
  }
  openLocation(location: HousingLocation) {
    this.adminPopup.openPopup(location);
  }

  openCreatePopup() {
    this.createApartmentPopup.openPopup();
  }
}
