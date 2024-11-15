import { Component, Input } from '@angular/core';
import { HousingLocation } from '../housinglocation';

@Component({
  selector: 'app-housing-location-admin',
  standalone: true,
  imports: [],
  templateUrl: './housing-location-admin.component.html',
  styleUrl: './housing-location-admin.component.scss'
})
export class HousingLocationAdminComponent {
  @Input() housingLocation!: HousingLocation;
}
