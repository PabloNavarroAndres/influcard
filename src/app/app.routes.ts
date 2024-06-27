import { Routes } from '@angular/router';
import { InflucardComponent } from './components/influcard/influcard.component';
import { InflucardDetallesComponent } from './components/influcard-detalles/influcard-detalles.component';

export const routes: Routes = [
    { path: '', component: InflucardComponent },
    { path: 'influcards', component: InflucardComponent },
    { path: 'influcard/detalles/:id', component: InflucardDetallesComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
