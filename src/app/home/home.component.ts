import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HousingLocationComponent
  ],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter>
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>
    <section class="results">
      <ng-container *ngIf="filteredLocationList.length > 0; else loading">
        <app-housing-location *ngFor="let housingLocation of filteredLocationList" [housingLocation]="housingLocation"></app-housing-location>
      </ng-container>
      <ng-template #loading>
        <p>{{ isLoading ? "Loading..." : "No results found" }}</p>
      </ng-template>
    </section>
  `,
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);
  filteredLocationList: HousingLocation[] = [];
  isLoading: boolean = true;

  constructor() {
    if (this.housingService.dataOriginLocal) {
      this.housingLocationList = this.housingService.getAllHousingLocations();
      this.filteredLocationList = this.housingLocationList;
    } else {
      this.housingService.getAsyncAllHousingLocations().then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
        this.filteredLocationList = housingLocationList;
      });
    }
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
    }

    this.filteredLocationList = this.housingLocationList.filter(
      housingLocation => housingLocation?.city.toLowerCase().includes(text.toLowerCase())
    );

    this.isLoading = false;
  }
}
