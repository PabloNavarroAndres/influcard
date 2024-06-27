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

  // Método para obtener la lista de InflucardResume directamente
  getInflucardResume(): Observable<InflucardResume> {
    return this._http.get<any>(this.influcardsUrl).pipe(
      map(data => {
        const influcard = data.influcard;
        return {
          id: influcard.id,
          username: influcard.username,
          age: influcard.age,
          gender: influcard.gender,
          country: influcard.country,
          rrss_name: influcard.rrss_name,
          rrss_icon: influcard.rrss_icon,
          engagement_formated: influcard.engagement_formated,
          engagement_rate: influcard.engagement_rate,
          impressions_formated: influcard.impressions_formated,
          interests: influcard.interests ? influcard.interests.split(' , ') : []
        } as InflucardResume;
      })
    );
  }


  // Obtener influcard por id
  getInflucardById(id: string): Observable<Influcard> {
    return this._http.get<Influcard[]>(this.influcardsUrl).pipe(
      map(influcards => influcards.find(influcard => influcard.id === id)!)
    );
  }

}
