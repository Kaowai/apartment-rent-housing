import { FormRegister } from './../../form-register';
import { HousingService } from './../housing.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HousingLocation } from '../housinglocation';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as uuid from 'uuid';
import { PopupService } from '../popup/popup.service';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDialogModule,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  housingLocationId!: string;
  popupService = inject(PopupService);

  applyForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
  });

  get firstName() {
    return this.applyForm.get('firstName');
  }
  get lastName() {
    return this.applyForm.get('lastName');
  }
  get phoneNumber() {
    return this.applyForm.get('phoneNumber');
  }
  get email() {
    return this.applyForm.get('email');
  }

  constructor(private router: Router) {
    this.housingLocationId = this.route.snapshot.params['id'];
    this.housingService
      .getHousingLocationId(String(this.housingLocationId))
      .subscribe((response) => {
        this.housingLocation = response;
      });
  }
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  submitApplication() {
    const newFormRegister: FormRegister = {
      firstName: this.applyForm.value.firstName ?? '',
      lastName: this.applyForm.value.lastName ?? '',
      email: this.applyForm.value.email ?? '',
      phoneNumber: this.applyForm.value.phoneNumber ?? '',
      locationId: String(this.housingLocationId),
      id: uuid.v4(),
    };
    this.popupService.openPopup(newFormRegister);

    this.housingService.addRegisterForm(newFormRegister).subscribe(
      (response) => {
        console.log('Thêm mới thành công', response);
      },
      (error) => {
        console.log('Thêm mới thất bại', error);
      }
    );
    this.housingService
      .getHousingLocationId(String(this.housingLocationId))
      .subscribe((location) => {
        const updatedAmountRegister = (location?.amountRegister ?? 0) + 1;

        this.housingService
          .updateLocationPartical(this.housingLocationId, {
            amountRegister: updatedAmountRegister,
          })
          .subscribe(
            (response) => {
              console.log('Cập nhật thành công', response);
            },
            (error) => {
              console.log('Lỗi khi cập nhật', error);
            }
          );
      });
    this.applyForm.reset();
  }
}
