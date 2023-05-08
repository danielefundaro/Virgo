import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AuthDefaultComponent } from './auth-default.component';
import { WalletComponent } from '../wallet/wallet.component';
import { WalletEditComponent } from '../wallet-edit/wallet-edit.component';
import { CredentialsComponent } from '../credentials/credentials.component';
import { CredentialEditComponent } from '../credential-edit/credential-edit.component';
import { NotesComponent } from '../notes/notes.component';
import { NoteEditComponent } from '../note-edit/note-edit.component';
import { PasswordGeneratorComponent } from '../password-generator/password-generator.component';
import { MasterPasswordComponent } from '../master-password/master-password.component';
import { MyGuard } from 'src/app/guard/my.guard';

const routes: Routes = [{
    path: '',
    component: AuthDefaultComponent,
    // canActivate: [MyGuard],
    children: [
        { path: 'wallet', component: WalletComponent, data: { animation: 'page' } },
        { path: 'wallet/:id', component: WalletEditComponent, data: { animation: 'page' } },
        { path: 'credentials', component: CredentialsComponent, data: { animation: 'page' } },
        { path: 'credentials/:id', component: CredentialEditComponent, data: { animation: 'page' } },
        { path: 'notes', component: NotesComponent, data: { animation: 'page' } },
        { path: 'notes/:id', component: NoteEditComponent, data: { animation: 'page' } },
        { path: 'password-generator', component: PasswordGeneratorComponent, data: { animation: 'page' } },
        { path: 'master-password', component: MasterPasswordComponent, pathMatch: 'full', data: { animation: 'masterPasswordPage' } },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthDefaultRoutingModule { }
