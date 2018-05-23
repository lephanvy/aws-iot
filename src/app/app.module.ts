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
// import { ControlComponent } from './page/control/control.component';



@NgModule({
  declarations: [
    AppComponent,
    // ControlComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdNativeDateModule,
    FormsModule,
    ComponentsModule,
    PagesModule,
    CommonModule
  ],
  providers: [
    MenuToggleService, 
    BarChartService,
    AreaChartService,
    UserLoginService,
    AuthGuardService,
    CognitoUtil,
      
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
