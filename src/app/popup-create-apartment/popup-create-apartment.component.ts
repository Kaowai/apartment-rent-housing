import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PopupCreateApartmentService } from './popup-create-apartment.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HousingService } from '../housing.service';
import { Cities } from '../cities';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { removeAccents } from '../../utils/removeAccents';
import { HousingLocation } from '../housinglocation';
import * as uuid from 'uuid';
import { StorageService } from '../storage.service';
import { supabaseConfig } from '../evironment';

@Component({
  selector: 'app-popup-create-apartment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-create-apartment.component.html',
  styleUrl: './popup-create-apartment.component.scss',
})
export class PopupCreateApartmentComponent implements OnInit {
  popupService = inject(PopupCreateApartmentService);
  housingService = inject(HousingService);
  citiesList: Cities[] = [];
  citiesListQueries: Cities[] = [];
  isResultsVisible: boolean = false;
  previewImageUrl: string | ArrayBuffer | null | undefined = null;
  selectedFile: File | null = null;
  storageService = inject(StorageService);

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 300;

  apartmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    bathrooms: new FormControl('', [Validators.required]),
    bedrooms: new FormControl('', [Validators.required]),
    laundry: new FormControl('', [Validators.required]),
    available: new FormControl('', [Validators.required]),
    wifi: new FormControl('', [Validators.required]),
    area: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
  });
  get name() {
    return this.apartmentForm.get('name');
  }
  get location() {
    return this.apartmentForm.get('location');
  }
  get bathrooms() {
    return this.apartmentForm.get('bathrooms');
  }
  get bedrooms() {
    return this.apartmentForm.get('bedrooms');
  }
  get laundry() {
    return this.apartmentForm.get('laundry');
  }

  get available() {
    return this.apartmentForm.get('available');
  }
  get wifi() {
    return this.apartmentForm.get('wifi');
  }
  get area() {
    return this.apartmentForm.get('area');
  }
  get state() {
    return this.apartmentForm.get('state');
  }

  constructor(public dialogRef: MatDialogRef<any>) {}
  ngOnInit(): void {
    this.housingService.getAllCities().subscribe((response) => {
      this.citiesList = response;
      this.searchSubject
        .pipe(debounceTime(this.debounceTimeMs), distinctUntilChanged())
        .subscribe((searchValue) => {
          this.performSearch(searchValue);
        });
    });
  }

  close() {
    this.popupService.closePopup();
  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageUrl = e.target?.result; // Cập nhật URL ảnh để hiển thị
        console.log(this.previewImageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  performSearch(searchValue: string) {
    if (searchValue === '') {
      this.citiesListQueries = this?.citiesList;
      return;
    }

    // Thực hiện lọc khi có dữ liệu
    this.citiesListQueries = this?.citiesList?.filter((city) =>
      removeAccents(city?.name)
        .toLowerCase()
        .includes(removeAccents(searchValue).toLowerCase())
    );
  }

  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchValue);
  }
  submitCreation() {
    if (this.selectedFile) {
      const generateId = uuid.v4();

      this.storageService
        .upload(supabaseConfig.bucketName, generateId, this.selectedFile)
        .subscribe({
          next: ({ data, error }) => {
            if (error) {
              console.error('Upload error:', error);
            } else {
              console.log('Upload succesfully: ', data);
              const url = `${supabaseConfig.supabaseUrl}/storage/v1/object/public/${supabaseConfig.bucketName}/${generateId}`;
              const apartment = this.createApartment(url, generateId);
              this.pushNewApartment(apartment);
            }
          },
          error: (err) => console.error('Unexpected error:', err),
        });
    } else {
      alert('Please choose at least one image selected');
    }
  }
  createApartment(imageUrl: string, id: string): HousingLocation {
    return {
      id: id,
      name: this.apartmentForm.value.name ?? '',
      city: this.apartmentForm.value.location ?? '',
      state: this.apartmentForm.value.state ?? '',
      photo: imageUrl,
      availableUnits: Number(this.apartmentForm.value.available),
      area: Number(this.apartmentForm.value.area),
      bedrooms: Number(this.apartmentForm.value.bedrooms),
      bathroom: Number(this.apartmentForm.value.bathrooms),
      wifi: Boolean(this.apartmentForm.value.wifi),
      laundry: Boolean(this.apartmentForm.value.laundry),
      amountRegister: 0,
    };
  }

  pushNewApartment(apartment: HousingLocation): void {
    this.housingService.addLocation(apartment).subscribe(
      (response) => {
        console.log('create successfully', response);
        this.housingService.notifyDataUpdate(true);
        this.popupService.closePopup();
      },
      (error) => {
        console.log('Create fail', error);
      }
    );
  }
  updateLocation(location: string) {
    console.log('click');
    this.isResultsVisible = false;
    this.apartmentForm.controls.location.setValue(location);
    console.log('location:', this.apartmentForm.value.location);
  }
}
