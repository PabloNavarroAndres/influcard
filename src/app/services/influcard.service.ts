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

  // Método para obtener el InflucardResume directamente,
  // (la lista de influcards se obtendrá duplicando el influcard
  // obtenido del JSON, simulando que he obtenido un array)
  getInflucardsResume(): Observable<InflucardResume[]> {
    return this._http.get<any>(this.influcardsUrl).pipe(
      map(data => {
        // Datos obtenidos del influcard
        const influcard = data.influcard;

        // Objeto InflucardResume
        const influcardResume: InflucardResume = {
          id: influcard.id,
          username: influcard.username,
          account_url: influcard.account_url,
          age: influcard.age,
          account_picture: influcard.account_picture,
          gender: influcard.gender,
          country: influcard.country,
          rrss_name: influcard.rrss_name,
          rrss_icon: influcard.rrss_icon,
          engagement_formated: influcard.engagement_formated,
          er_audiencia: influcard.er_audiencia,
          followers_fake: influcard.followers_fake,
          impressions_formated: influcard.impressions_formated,
          interests: influcard.interests
        };

        // Crear un array de 12 elementos con el influcardResume duplicado
        const influcardResumes: InflucardResume[] = Array(12).fill(influcardResume);
        return influcardResumes;
      })
    );
  }


  // Método para obtener un influcard por ID
  getInflucardById(id: string): Observable<Influcard | undefined> {
    return this._http.get<any>(this.influcardsUrl).pipe(
      map(data => {
        // Obtenemos el influcard de los datos devueltos
        const influcard = data.influcard;

        // Comprobar si coincide el id del influcard con el id del parámetro
        if (influcard.id === id) {

          return {
            // Mapea los campos comunes de InflucardResume a Influcard
            ...this.mapToInflucardResume(influcard),

            // Campos de Influcard
            reach_formated_graph: influcard.reach_formated_graph,
            relevance_formated_graph: influcard.relevance_formated_graph,
            resonance_formated_graph: influcard.resonance_formated_graph,
            followers_formated: influcard.followers_formated,
            real_followers_formated: influcard.real_followers_formated,
            fake_followers_formated: influcard.fake_followers_formated,
            followers_fake: influcard.followers_fake,
            insight_perc_13: influcard.insight_perc_13,
            insight_perc_18: influcard.insight_perc_18,
            insight_perc_25: influcard.insight_perc_25,
            insight_perc_35: influcard.insight_perc_35,
            insight_perc_45: influcard.insight_perc_45,
            insight_perc_65: influcard.insight_perc_65,
            insight_perc_m: influcard.insight_perc_m,
            insight_perc_f: influcard.insight_perc_f,
            top_countries_formated: influcard.top_countries_formated,
            post_territory: influcard.post_territory,
            account_post_moment: influcard.account_post_moment,
            brands_images: influcard.brands_images,
            reach_formated: influcard.reach_formated,
            ir_alcance: influcard.ir_alcance,
            ir_audiencia: influcard.ir_audiencia,
            vplays_formated: influcard.vplays_formated,
            vr_alcance: influcard.vr_alcance,
            vr_audiencia: influcard.vr_audiencia,
            er_alcance: influcard.er_alcance,
            er_audiencia: influcard.er_audiencia,
            post_week_day: influcard.post_week_day.map((day: any) => ({ engrate: day.engrate }))
          } as Influcard;
        } else {
          return undefined;
        }
      })
    );
  }

  // Metodo para mapear datos de InflucardResume a un Influcard
  private mapToInflucardResume(influcard: any): InflucardResume {
    return {
      id: influcard.id,
      username: influcard.username,
      account_url: influcard.account_url,
      age: influcard.age,
      account_picture: influcard.account_picture,
      gender: influcard.gender,
      country: influcard.country,
      rrss_name: influcard.rrss_name,
      rrss_icon: influcard.rrss_icon,
      engagement_formated: influcard.engagement_formated,
      er_audiencia: influcard.er_audiencia,
      followers_fake: influcard.followers_fake,
      impressions_formated: influcard.impressions_formated,
      interests: influcard.interests
    };
  }

}
