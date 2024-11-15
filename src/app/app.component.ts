import { FormsModule } from '@angular/forms';
import { Cities } from './cities';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { HousingService } from './housing.service';
import { LocationComponent } from './location/location.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { removeAccents } from '../utils/removeAccents';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    LocationComponent,
    RouterModule,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './app.component.html', // có thể sử dụng template `` và sau đó viết thẳng code HTML vô đây luôn cũng được
  styleUrl: './app.component.scss', // có thể sử dụng style `` và sau đó viết thẳng code SCSS vô đây luôn cũng được nhé,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'house-management';
  housingService = inject(HousingService);
  isResultsVisible = false;
  citiesListQueries: Cities[] = [];
  citiesList: Cities[] = [];

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 300; // debounce time
  constructor(private router: Router) {}

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

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

  showResults() {
    this.isResultsVisible = true;
  }

  hideResults() {
    this.isResultsVisible = false;
  }

  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchValue);
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

  filterResults(value: string) {
    if (value === '' || value === undefined) {
      this.router.navigate(['/explore']);
    } else {
      this.router.navigate(['/explore'], { queryParams: { name: value } });
    }
  }
}
