import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { DefaultComponent } from './default.component';
import { VaultComponent } from '../vault/vault.component';
import { CredentialsComponent } from '../credentials/credentials.component';

const routes: Routes = [{
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
        { path: 'vault', component: VaultComponent },
        { path: 'passwords', component: CredentialsComponent },
        { path: 'notes', component: VaultComponent },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DefaultRoutingModule { }
