import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchUserPlaces('http://localhost:3000/places', 'Failed to fetch available places');
  }

  loadUserPlaces() {
    return this.fetchUserPlaces('http://localhost:3000/user-places', 'Failed to fetch favorite places').pipe(
      tap((places) => {
        this.userPlaces.set(places);
      }
      )
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if (!prevPlaces.find((p) => p.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.httpClient.put('http://localhost:3000/user-places', { placeId: place.id }).pipe(
      catchError((error) => {
        this.userPlaces.set(prevPlaces);
        return throwError(() => new Error('Failed to add place to user places'));
      }
      ));
  }

  removeUserPlace(place: Place) { }

  private fetchUserPlaces(url: string, errorMesage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((data) => data.places),
      catchError((error) => {
        return throwError(() => new Error(errorMesage));
      }
      ))
  }
}
