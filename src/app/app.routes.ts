import { Routes } from '@angular/router';

export const routes: Routes = [
    /* { path: '', component: ? },
    { path: 'influcards', component: ? }, */
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
