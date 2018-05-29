import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdNativeDateModule} from '@angular/material';

import { AppComponent } from './app.component';

import { ComponentsModule } from './modules/components.module';
import { PagesModule } from './modules/pages.module';

import { MenuToggleService } from './services/menu-toggle.service';
import { BarChartService } from './services/bar-chart.service';
import { AreaChartService } from './services/area-chart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserLoginService } from './services/login.service';
import { AuthGuardService } from './services/auth-guard.service';
import { CognitoUtil } from './services/auth.service';
import { UserRegistrationService } from './services/user-registration.service';
import { TrendService } from './services/trend.service';
import { HttpModule } from '@angular/http';
//import { ReportComponent } from './pages/report/report.component';
// import { ControlComponent } from './page/control/control.component';
import * as FusionCharts from 'fusioncharts';
import { FusionChartsModule } from 'angular4-fusioncharts';

FusionChartsModule.fcRoot(FusionCharts);


@NgModule({
  declarations: [
    AppComponent,
   // ReportComponent,
    // ControlComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdNativeDateModule,
    FormsModule,
    ComponentsModule,
    PagesModule,
    CommonModule,
    HttpModule,
    FusionChartsModule
  ],
  providers: [
    MenuToggleService, 
    BarChartService,
    AreaChartService,
    UserLoginService,
    AuthGuardService,
    CognitoUtil,
      UserRegistrationService,
      TrendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

