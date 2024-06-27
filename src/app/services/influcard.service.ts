import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Influcard } from '../models/influcard-model';
import { InflucardResume } from '../models/influcard-resume.model';

@Injectable({
  providedIn: 'root'
})
export class InflucardService {

  // Modulo http
  private _http = inject(HttpClient);
  // Ruta del archivo JSON con los datos del influencer
  private influcardsUrl = 'assets/data.json';

  // Obtener todos los influcard con la información resumida
  getInflucards(): Observable<InflucardResume[]> {
    return this._http.get<InflucardResume[]>(this.influcardsUrl);
  }

  // Obtener influcard por id
  getInflucardById(id: string): Observable<Influcard> {
    return this._http.get<Influcard[]>(this.influcardsUrl).pipe(
      map(influcards => influcards.find(influcard => influcard.id === id)!)
    );
  }

}
