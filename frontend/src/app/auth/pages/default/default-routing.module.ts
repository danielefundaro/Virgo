import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { DefaultComponent } from './default.component';
import { WalletComponent } from '../wallet/wallet.component';
import { CredentialsComponent } from '../credentials/credentials.component';

const routes: Routes = [{
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
        { path: 'wallet', component: WalletComponent },
        { path: 'passwords', component: CredentialsComponent },
        { path: 'notes', component: WalletComponent },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DefaultRoutingModule { }
