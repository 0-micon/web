import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

const baseUrl = "http://localhost:3000";
const basePath = "/workouts";
const locationsPath = "/locations";
const performancePath = "/performanceTargets";

const workoutsUrl = baseUrl + basePath;
const idToWorkout = id => workoutsUrl + "/" + id;

const locationsUrl = baseUrl + locationsPath;
const performanceUrl = baseUrl + performancePath;

@Injectable({
  providedIn: "root"
})
export class WorkoutsApiService {
  constructor(private http: HttpClient) {}

  getWorkouts(): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(workoutsUrl);
  }

  getWorkout(id: number): Observable<any> {
    return this.http.get(idToWorkout(id));
  }

  addWorkout(workout: any): Observable<any> {
    return this.http.post(workoutsUrl, workout);
  }

  updateWorkout(id: number, workout: any): Observable<any> {
    return this.http.put(idToWorkout(id), workout);
  }

  saveWorkout(workout: any): Observable<any> {
    if (workout.id) {
      return this.updateWorkout(workout.id, workout);
    } else {
      return this.addWorkout(workout);
    }
  }

  deleteWorkout(id: number): Observable<any> {
    return this.http.delete(idToWorkout(id));
  }

  getLocations(): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(locationsUrl);
  }

  searchLocations(term: string): Observable<any> {
    return this.http.get(locationsUrl + "?q=" + term);
  }

  getPerfTargets(): Observable<any> {
    return this.http.get(performanceUrl);
  }

  setPerfTargets(perfTargets: any): Observable<any> {
    console.log("Saving:", perfTargets);
    return this.http.put(performanceUrl, perfTargets);
  }
}
