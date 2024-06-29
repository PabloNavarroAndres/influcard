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
    this.influcard = this._influcardService.getInflucardData();
  }

}
