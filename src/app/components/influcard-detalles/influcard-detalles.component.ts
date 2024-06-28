import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Influcard } from '../../models/influcard-model';
import { InflucardService } from '../../services/influcard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-influcard-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './influcard-detalles.component.html',
  styleUrl: './influcard-detalles.component.css'
})
export class InflucardDetallesComponent {
  // Influcard que consultaremos
  influcard?: Influcard;

  private _route = inject(ActivatedRoute);
  private _influcardService = inject(InflucardService);

  ngOnInit(): void {
    
    // Se busca la influcard de la que vamos a ver detalles
    this.getInflucard();
  }

  // Obtener influcard buscada por id
  getInflucard(): void {
    // Obtener el id de los parametros de ruta
    const id = this._route.snapshot.paramMap.get('id');

    // Si hay parámetro de id se procede a usarlo
    if (id) {

      // Obtener el influcard buscado por id
      this._influcardService.getInflucardById(id).subscribe ({
        next: (data?: Influcard) => {
          this.influcard = data;
        },
        error(err) {
          console.error('Error obteniendo datos de Influcard:', err);
        },
      })

    }
  } 
}
