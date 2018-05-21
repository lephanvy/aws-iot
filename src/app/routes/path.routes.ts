import { HomeComponent } from '../pages/home/home.component';
import { ProgressPageComponent } from '../pages/progress-page/progress-page.component';
import { ChartBarPageComponent } from '../pages/chart-bar-page/chart-bar-page.component';
import { ChartLinePageComponent } from '../pages/chart-line-page/chart-line-page.component';
import { ChartAreaPageComponent } from '../pages/chart-area-page/chart-area-page.component';
import { ChartOtherPageComponent } from '../pages/chart-other-page/chart-other-page.component';

import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { ForgotPassPageComponent } from '../pages/forgot-pass-page/forgot-pass-page.component';
import { ErrorPageComponent } from '../pages/error-page/error-page.component';
import { ControlComponent } from '../pages/control/control.component';

export const routesPath = [
  { path: '', component: HomeComponent },
 
  { path: 'ui/progress', component: ProgressPageComponent },
  
  { path: 'chart/bar', component: ChartBarPageComponent },
  { path: 'chart/line', component: ChartLinePageComponent },
  { path: 'chart/area', component: ChartAreaPageComponent },
  { path: 'chart/others', component: ChartOtherPageComponent },
  
  { path: 'other-page/login', component: LoginPageComponent },
  { path: 'other-page/forgot-pass', component: ForgotPassPageComponent },
  { path: 'other-page/error', component: ErrorPageComponent },
  { path: 'controls', component : ControlComponent}
];
