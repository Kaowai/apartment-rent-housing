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
import { removeAccents } from '../../utils/removeAccents';

@Component({
  selector: 'app-apartment-management',
  standalone: true,
  imports: [HousingLocationAdminComponent, CommonModule, MatDialogModule],
  templateUrl: './apartment-management.component.html',
  styleUrl: './apartment-management.component.scss',
})
export class ApartmentManagementComponent implements OnInit {
  originalHousingLocationList: HousingLocation[] = [];
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
        this.originalHousingLocationList = housingLocationList;
      });
  }
  openLocation(location: HousingLocation) {
    this.adminPopup.openPopup(location);
  }

  openCreatePopup() {
    this.createApartmentPopup.openPopup();
  }

  onSearch(filter: string, address: string, state: string, sort: string) {
    this.housingLocationList = [...this.originalHousingLocationList];

    this.sortWithName(filter);
    this.sortWithState(state);
    this.sortWithSort(sort);
    this.sortWithAddress(address);
    console.log(this.housingLocationList);
  }

  sortWithName(filter: string) {
    if (!filter) return;
    this.housingLocationList = this.housingLocationList.filter(
      (housingLocation) =>
        removeAccents(housingLocation.name)
          .toLowerCase()
          .includes(removeAccents(filter).toLowerCase())
    );
  }

  sortWithAddress(address: string) {
    if (!address) return;
    this.housingLocationList = this.housingLocationList.filter(
      (housingLocation) =>
        removeAccents(housingLocation.city)
          .toLowerCase()
          .includes(removeAccents(address).toLowerCase())
    );
  }

  sortWithState(state: string) {
    if (state === 'All') return;
    this.housingLocationList = this.housingLocationList.filter(
      (housingLocation) =>
        removeAccents(housingLocation.state)
          .toLowerCase()
          .includes(removeAccents(state).toLowerCase())
    );
  }

  sortWithSort(sort: string) {
    if (sort === 'Sort') return;
    if (sort === 'mintomax') {
      this.housingLocationList.sort(
        (a, b) => a.amountRegister - b.amountRegister
      );
    } else {
      this.housingLocationList.sort(
        (a, b) => b.amountRegister - a.amountRegister
      );
    }
  }
}
