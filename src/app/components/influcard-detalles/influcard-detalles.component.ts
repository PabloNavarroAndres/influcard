import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Influcard } from '../../models/influcard-model';
import { InflucardService } from '../../services/influcard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-influcard-detalles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './influcard-detalles.component.html',
  styleUrl: './influcard-detalles.component.css'
})
export class InflucardDetallesComponent {
  // Influcard que consultaremos
  influcard?: Influcard;

  private _route = inject(ActivatedRoute);
  private _influcardService = inject(InflucardService);
 
  // Porcentaje Reach formateado para el svg
  get reachPercentage(): string {
    return `${this.influcard?.reach_formated_graph || 0}, 100`;
  }

  // Porcentaje Relevance formateado para el svg
  get relevancePercentage(): string {
    return `${this.influcard?.relevance_formated_graph || 0}, 100`;
  }
  
  // Porcentaje Resonance formateado para el svg
  get resonancePercentage(): string {
    return `${this.influcard?.resonance_formated_graph || 0}, 100`;
  }

  ngOnInit(): void {
    
    /* MANTENER ESTA FUNCION AL TERMINAR PROYECTO: */
    /* // Se busca la influcard de la que vamos a ver detalles
    this.influcard = this._influcardService.getInflucardData(); */

    /* Obtenerlo directamente al entrar (TEMPORAL - BORRAR AL TERMINAR) */
    this._influcardService.getInflucardById("4__4355072").subscribe ({
      next: (data?: Influcard) => {
        this.influcard = data;

        // Guardar influcard encontrado en el servicio influcard
        this._influcardService.setInflucardData(data);
      },
      error: (err) => {

        console.error('Error obteniendo datos de Influcard:', err);
      }
    });
  }

  descargarInflucard(): void {
    /* ... */
  }

}
