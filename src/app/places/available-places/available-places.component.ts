import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  private destroyRef = inject(DestroyRef);

  constructor(private placeService: PlacesService) { }

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placeService.loadAvailablePlaces().subscribe({
      next: (places) => {
        console.log('places', places);
        this.places.set(places);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    }
    );
  }

  onSelectPlace(place: Place) {
    const subscription = this.placeService.addPlaceToUserPlaces(place).subscribe({
      next: () => {
        console.log('place added');
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
