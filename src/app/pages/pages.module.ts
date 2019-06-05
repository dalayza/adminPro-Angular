import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { FormsModule } from '@angular/forms';

import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';

// Temporal
import { IncrementalComponent } from '../components/incremental/incremental.component';

// ng2-chart
import { ChartsModule } from 'ng2-charts';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';

// AccountSetting
import { AccountSettingComponent } from './account-setting/account-setting.component';

@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementalComponent,
        GraficoDonaComponent,
        AccountSettingComponent
      ],
      exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
      ],
      imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule
      ]
})

export class PagesModule { }
