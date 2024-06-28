import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Influcard } from '../../models/influcard-model';
import { InflucardService } from '../../services/influcard.service';
import { InflucardResume } from '../../models/influcard-resume.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-influcard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './influcard.component.html',
  styleUrl: './influcard.component.css'
})
export class InflucardComponent {
  influcard?: Influcard;

  // Array de influcards
  influcards: InflucardResume[] = [];

  private _influcardService = inject(InflucardService);

  ngOnInit(): void {
    // Obtener influcard resumida para las fichas
    this._influcardService.getInflucardsResume().subscribe ({
      next: (data: InflucardResume[]) => {
        this.influcards = data;
      },
      error(err) {
        console.error('Error obteniendo datos de InflucardResume:', err);
      },
    })

    this._influcardService.getInflucardById("4__4355072").subscribe ({
      next: (data?: Influcard) => {
        this.influcard = data;
      },
      error(err) {
        console.error('Error obteniendo datos de Influcard:', err);
      },
    })
  }

  /* // Obtener influcard buscada por id
  getInflucardById(id: string): void {
    this._influcardService.getInflucardById(id).subscribe ({
      next: (data?: Influcard) => {
        this.influcard = data;
      },
      error(err) {
        console.error('Error obteniendo datos de Influcard:', err);
      },
    });
  } */

}
