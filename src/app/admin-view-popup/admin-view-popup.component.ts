import { distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';
import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminPopupService } from './admin-popup.service';
import { HousingLocation } from '../housinglocation';
import { HousingService } from '../housing.service';
import { FormRegister } from '../../form-register';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Cities } from '../cities';
import { debounceTime, of, Subject } from 'rxjs';
import { removeAccents } from '../../utils/removeAccents';
import { StorageService } from '../storage.service';
import { supabaseConfig } from '../evironment';

@Component({
  selector: 'app-admin-view-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-view-popup.component.html',
  styleUrl: './admin-view-popup.component.scss',
})
export class AdminViewPopupComponent implements OnInit, OnDestroy {
  popupService = inject(AdminPopupService);
  housingService = inject(HousingService);
  housingLocation!: HousingLocation;
  formRegisterList: FormRegister[] = [];
  isEdit: boolean = false;
  isResultsVisible: boolean = false;
  citiesListQueries: Cities[] = [];
  citiesList: Cities[] = [];
  city: string = '';
  previewImageUrl: string | ArrayBuffer | null | undefined = null;
  selectedFile: File | null = null;
  updateImageUrl: string = '';
  bucket: string = '21520537';

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 300;

  apartmentForm = new FormGroup({
    location: new FormControl('', [Validators.required]),
    bathrooms: new FormControl('', [Validators.required]),
    bedrooms: new FormControl('', [Validators.required]),
    laundry: new FormControl('', [Validators.required]),
    available: new FormControl('', [Validators.required]),
    wifi: new FormControl('', [Validators.required]),
    area: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
  });

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HousingLocation,
    public dialogRef: MatDialogRef<any>,
    private storageService: StorageService
  ) {
    this.housingLocation = { ...data };
    this.city = this.housingLocation.city;
  }

  ngOnInit(): void {
    this.housingService
      .getAllRegisterForm()
      .subscribe((formRegisterList: FormRegister[]) => {
        this.formRegisterList = formRegisterList.filter((formRegister) => {
          return (
            String(formRegister.locationId) === String(this.housingLocation.id)
          );
        });
      });

    this.storageService
      .download(this.bucket, String(this.housingLocation.id))
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
          } else {
            console.log('Download Image successfully', data);
            if (data instanceof Blob) {
              const imageUrl = URL.createObjectURL(data);
              this.housingLocation.photo = imageUrl;
            }
          }
        },
        error: (error) => {
          console.log('Get image Failed', error);
        },
      });

    this.housingService.getAllCities().subscribe((response) => {
      this.citiesList = response;
      this.searchSubject
        .pipe(debounceTime(this.debounceTimeMs), distinctUntilChanged())
        .subscribe((searchValue) => {
          this.performSearch(searchValue);
        });
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }
  close() {
    this.popupService.closePopup();
  }
  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchValue);
  }
  onDelete(id: string) {
    this.housingService
      .deleteFormRegister(id)
      .pipe(
        switchMap((response) => {
          console.log('Delete successfully,', response);

          // Lấy thông tin Housing Location sau khi xóa
          return this.housingService.getHousingLocationId(
            String(this.housingLocation.id)
          );
        }),
        switchMap((location) => {
          const updatedAmountRegister = (location?.amountRegister ?? 0) - 1;

          // Cập nhật số lượng amountRegister
          return this.housingService.updateLocationPartical(
            this.housingLocation.id,
            {
              amountRegister: updatedAmountRegister,
            }
          );
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Cập nhật thành công', response);

          // Cập nhật danh sách formRegisterList
          this.formRegisterList = this.formRegisterList.filter(
            (formRegister) => formRegister.id !== id
          );

          // Gửi thông báo dữ liệu đã được cập nhật
          this.housingService.notifyDataUpdate(true);
        },
        error: (error) => {
          console.log('Lỗi xảy ra trong quá trình xử lý:', error);
        },
      });
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
  deleteLocation() {
    this.housingService
      .deleteLocation(this.housingLocation.id)
      .pipe(
        switchMap((response) => {
          console.log('Deleted on database successfully', response);
          return this.storageService.remove(
            this.bucket,
            this.housingLocation.id
          );
        })
      )
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            console.log('Deleted failed', error);
          } else {
            console.log('Deleted completed', data);
            this.housingService.notifyDataUpdate(true);
            this.popupService.closePopup();
          }
        },
        error: (error) => {
          console.log('Something went wrong', error);
        },
      });
  }

  // handle edit apartment location
  editLocation() {
    // handle update
    if (this.isEdit === true) {
      if (this.selectedFile) {
        const id = this.housingLocation.id;

        // Upload hình ảnh lên Supabase và xử lý logic tiếp theo
        this.storageService
          .upload(this.bucket, String(id), this.selectedFile)
          .pipe(
            switchMap(({ data, error }) => {
              if (error) {
                console.log('Push image fail: ', error);
                // Nếu upload thất bại, chuyển sang update file
                return this.storageService.update(
                  this.bucket,
                  id,
                  this.selectedFile!
                );
              } else {
                console.log('Push image successfully', data);
                // Nếu upload thành công, trả về một Observable hoàn thành
                const url = `${supabaseConfig.supabaseUrl}/storage/v1/object/public/${this.bucket}/${id}`;
                const updatedLocation = this.createApartment(url);
                this.pushHousingService(updatedLocation);
                return of({ data, error: null }); // Kết thúc luồng nếu không cần thực hiện thêm
              }
            })
          )
          .subscribe({
            next: ({ data, error }) => {
              if (error) {
                console.log('Update fail: ', error);
              } else {
                console.log('Update again', data);
                const url = `${supabaseConfig.supabaseUrl}/storage/v1/object/public/${this.bucket}/${id}`;
                const updatedLocation = this.createApartment(url);
                this.pushHousingService(updatedLocation);
              }
            },
            error: (error) => {
              console.log('Final error: ', error);
            },
          });
      } else {
        // Không có file mới, chỉ cập nhật thông tin
        const updatedLocation = this.createApartment(
          this.housingLocation.photo
        );
        this.pushHousingService(updatedLocation);
      }
    } else {
      // Xử lý logic khác khi không phải chế độ chỉnh sửa
    }
    this.isEdit = !this.isEdit;
  }

  pushHousingService(updatedLocation: HousingLocation): void {
    this.housingService
      .updateLocation(this.housingLocation.id, updatedLocation)
      .subscribe(
        (response) => {
          this.housingService.notifyDataUpdate(true);
          this.refreshData();
        },
        (error) => {
          console.log('Update failure', error);
        }
      );
  }

  createApartment(imgeUrl: string): HousingLocation {
    return {
      id: this.housingLocation.id,
      name: this.housingLocation.name,
      city: this.apartmentForm.value.location ?? '',
      state: this.apartmentForm.value.state ?? '',
      photo: imgeUrl,
      availableUnits: Number(this.apartmentForm.value.available),
      area: Number(this.apartmentForm.value.area),
      bedrooms: Number(this.apartmentForm.value.bedrooms),
      bathroom: Number(this.apartmentForm.value.bathrooms),
      wifi: Boolean(this.apartmentForm.value.wifi),
      laundry: Boolean(this.apartmentForm.value.laundry),
      amountRegister: this.housingLocation.amountRegister,
    };
  }

  refreshData() {
    this.housingService
      .getHousingLocationId(this.housingLocation.id)
      .pipe(
        switchMap((housingLocation) => {
          this.housingLocation = housingLocation!;
          // Bắt đầu tải hình ảnh sau khi nhận được thông tin location
          return this.storageService.download(
            this.bucket,
            String(this.housingLocation.id)
          );
        })
      )
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            console.log('Download Image error: ', error);
          } else {
            console.log('Download Image successfully', data);
            if (data instanceof Blob) {
              const imageUrl = URL.createObjectURL(data);
              this.housingLocation.photo = imageUrl;
              console.log(imageUrl);
            }
          }
        },
        error: (error) => {
          console.log('Get image Failed', error);
        },
      });

    this.updateImageUrl = '';
  }

  updateLocation(location: string) {
    console.log('click');
    this.isResultsVisible = false;
    this.apartmentForm.controls.location.setValue(location);
    console.log('location:', this.apartmentForm.value.location);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageUrl = e.target?.result; // Cập nhật URL ảnh để hiển thị
      };
      reader.readAsDataURL(file);
    }
  }
}
