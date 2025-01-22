import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient)

  ngOnInit() {
    this.httpClient.get<{places: Place[]}>('http://localhost:3000/places')
      .subscribe({
        next: (data) => {
          console.log('places', data.places);
          this.places.set(data.places);
        }
      });
  }
}
