import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { ProfileComponent } from './profile/profile.component';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';

import { LoginGuardGuard } from '../services/guards/login-guard.guard';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
            { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Graficas' } },
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
            { path: 'account-setting', component: AccountSettingComponent, data: { titulo: 'Ajustes del tema' } },
            { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil de Usuario' } },

            // Mantenimientos
            { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Mantenimientos de Usuarios' } },
            { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimientos de Hospitales' } },
            { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimientos de Medicos' } },
            { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Actualizar Medico' } },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
