import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from './components.module';

import { routesPath } from '../routes/path.routes';

import 'hammerjs';
import { HomeComponent } from '../pages/home/home.component';

import { ProgressPageComponent } from '../pages/progress-page/progress-page.component';
import { ChartBarPageComponent } from '../pages/chart-bar-page/chart-bar-page.component';
import { ChartLinePageComponent } from '../pages/chart-line-page/chart-line-page.component';
import { ChartAreaPageComponent } from '../pages/chart-area-page/chart-area-page.component';
import { ChartOtherPageComponent } from '../pages/chart-other-page/chart-other-page.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';
import { ForgotPassPageComponent } from '../pages/forgot-pass-page/forgot-pass-page.component';
import { ConfirmMailPageComponent } from '../pages/confirm-mail-page/confirm-mail-page.component';
import { ErrorPageComponent } from '../pages/error-page/error-page.component';
import { CommonModule } from '@angular/common';
import { ControlComponent } from '../pages/control/control.component';
import { FormsModule } from '@angular/forms';
import { ButtonsPageComponent } from '../pages/buttons-page/buttons-page.component';

export const ROUTES: Routes = routesPath;

@NgModule({
  imports: [
    MaterialModule,
    ComponentsModule,
    RouterModule.forRoot(ROUTES),
    CommonModule,
    FormsModule
  ],
  exports: [
    RouterModule,
    HomeComponent,
    ProgressPageComponent,
    ChartBarPageComponent,
    ChartLinePageComponent,
    ChartAreaPageComponent,
    ChartOtherPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ForgotPassPageComponent,
    ConfirmMailPageComponent,
    ErrorPageComponent,
    ControlComponent,
    ButtonsPageComponent
  ],
  declarations: [
    HomeComponent,
    ProgressPageComponent,
    ChartBarPageComponent,
    ChartLinePageComponent,
    ChartAreaPageComponent,
    ChartOtherPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ForgotPassPageComponent,
    ConfirmMailPageComponent,
    ErrorPageComponent,
    ControlComponent,
    ButtonsPageComponent
  ],

})
export class PagesModule { }
