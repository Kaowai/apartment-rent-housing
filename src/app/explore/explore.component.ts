import { Component, inject, OnInit } from '@angular/core';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housinglocation';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingService } from '../housing.service';
import { removeAccents } from '../../utils/removeAccents';
@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [HousingLocationComponent, CommonModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent implements OnInit {
  housingService = inject(HousingService);
  value: string = '';
  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.housingService
      .getAllHousingLocations()
      .subscribe((housingLocationList) => {
        this.housingLocationList = housingLocationList;

        this.route.queryParams.subscribe((p) => {
          const data = p;
          this.value = data['name'];

          if (this.value === undefined || this.value === '') {
            this.filteredLocationList = this.housingLocationList;
            return;
          }

          this.filteredLocationList = this.housingLocationList.filter(
            (housingLocation) => {
              return removeAccents(
                housingLocation?.city.toLowerCase().trim()
              ).includes(removeAccents(this.value.toLowerCase().trim()));
            }
          );

          console.log('filters: ', this.filteredLocationList);
        });
      });
  }
}
