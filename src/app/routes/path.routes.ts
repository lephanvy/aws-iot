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
import { ControlComponent } from '../pages/control/control.component';
import { ButtonsComponent } from '../components/ui-elements/buttons/buttons.component';
import { ButtonsPageComponent } from '../pages/buttons-page/buttons-page.component';

export const routesPath = [
  { path: '', component: HomeComponent },
  { path: 'controls', component: ControlComponent},
  { path: 'trend', component: ChartAreaPageComponent},
  { path: 'login', component: LoginPageComponent},
    {path: 'button', component: ButtonsPageComponent},
    {path: 'new-password', component: ForgotPassPageComponent}
];
