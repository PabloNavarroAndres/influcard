import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Influcard } from '../../models/influcard-model';
import { InflucardService } from '../../services/influcard.service';
import { InflucardResume } from '../../models/influcard-resume.model';

@Component({
  selector: 'app-influcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './influcard.component.html',
  styleUrl: './influcard.component.css'
})
export class InflucardComponent {
  influcard?: Influcard;
  influcardResume?: InflucardResume;

  private _influcardService = inject(InflucardService);

  ngOnInit(): void {
    // Obtener influcard resumida para las fichas
    this._influcardService.getInflucardResume().subscribe ({
      next: (data: InflucardResume) => {
        this.influcardResume = data;
      },
      error(err) {
        console.error('Error fetching Influcard data:', err);
      },
    })
  }

  // Obtener influcard buscada por id
  getInflucardById(id: string): void {
    this._influcardService.getInflucardById(id).subscribe ({
      next: (data: Influcard) => {
        this.influcard = data;
      },
      error(err) {
        console.error('Error fetching Influcard data:', err);
      },
    });
  }

  // Devolver un array con el rango del parametro,
  // para crear el bucle for con el limite a elegir
  getRange(n: number): number[] {
    return Array.from({length: n});
  }
}
