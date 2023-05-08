import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default.component';
import { LoginComponent } from '../login/login.component';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

const routes: Routes = [{
    path: '',
    component: DefaultComponent,
    children: [
        { path: 'login', component: LoginComponent },
        { path: 'registration', component: RegisterUserComponent },
        { path: 'reset-credentials', component: ForgotPasswordComponent },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DefaultRoutingModule { }
