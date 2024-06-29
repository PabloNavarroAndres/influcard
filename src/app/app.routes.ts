import { RouterModule, Routes } from '@angular/router';
import { InflucardComponent } from './components/influcard/influcard.component';
import { InflucardDetallesComponent } from './components/influcard-detalles/influcard-detalles.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', component: InflucardComponent },
    { path: 'influcards', component: InflucardComponent },
    { path: 'influcard/detalles', component: InflucardDetallesComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
