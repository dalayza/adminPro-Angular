import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { NonpagefoundComponent } from './nonpagefound/nonpagefound.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

// Pipes
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
      NonpagefoundComponent,
      HeaderComponent,
      SidebarComponent,
      BreadcrumbsComponent
    ],
    exports: [
      NonpagefoundComponent,
      HeaderComponent,
      SidebarComponent,
      BreadcrumbsComponent
    ],
    imports: [
      RouterModule,
      CommonModule,
      PipesModule
    ]
})

export class SharedModule { }