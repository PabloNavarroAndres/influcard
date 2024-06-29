import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Influcard } from '../../models/influcard-model';
import { InflucardService } from '../../services/influcard.service';
import { InflucardResume } from '../../models/influcard-resume.model';
import { Router, RouterLink } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ShortNumberPipe } from '../../pipes/short-number.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-influcard',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe, ShortNumberPipe],
  templateUrl: './influcard.component.html',
  styleUrl: './influcard.component.css'
})
export class InflucardComponent {
  influcard?: Influcard;

  // Array de influcards
  influcards: InflucardResume[] = [];

  private _influcardService = inject(InflucardService);
  private router = inject(Router);

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

  // Animacion "Ripple" al dar click a la imagen
  onImageClick(event: MouseEvent, id: string) {
    const target = event.currentTarget as HTMLElement;
    // Añadir efecto "ripple"
    target.classList.add('ripple');

    // Mostrar la animación de carga
    this.loadingCard(id);

    // Eliminar la clase ripple después de un tiempo
    setTimeout(() => {
      target.classList.remove('ripple');
    }, 500);
  }

  // Animacion de carga de detalles de influcard
  loadingCard(id: string) {
    let timerInterval;
    Swal.fire({
      title: "Cargando...",
      html: "Espere un momento por favor...",
      timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup()!.querySelector("b");
      },
      willClose: () => {
        clearInterval(timerInterval!);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        // Llamar a la función para obtener Influcard por ID
        this.getInflucardById(id);
        console.log("I was closed by the timer");
      }
    });
  }


  // Obtener influcard buscada por id
  /* getInflucardById(id: string): void {
    this._influcardService.getInflucardById(id).subscribe ({
      
      next: (data?: Influcard) => {
        this.influcard = data;
      },
      error(err) {
        console.error('Error obteniendo datos de Influcard:', err);
      },
    });
  } */

  // Obtener influcard buscada por id
  getInflucardById(id: string): void {

    this._influcardService.getInflucardById(id).subscribe ({
      next: (data?: Influcard) => {
        this.influcard = data;

        // Guardar influcard encontrado en el servicio influcard
        this._influcardService.setInflucardData(data);

        // Cerrar el SweetAlert al terminar
        Swal.close(); 

        // Redirigir al componente de detalles después de obtener los datos
        this.router.navigate(['/influcard/detalles']);
      },
      error: (err) => {

        console.error('Error obteniendo datos de Influcard:', err);

        // Cerrar el SweetAlert en caso de error
        Swal.close();
      }
    });
  }


}
