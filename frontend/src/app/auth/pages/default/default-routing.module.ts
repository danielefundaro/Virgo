import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { DefaultComponent } from './default.component';
import { WalletComponent } from '../wallet/wallet.component';
import { WalletEditComponent } from '../wallet-edit/wallet-edit.component';
import { CredentialsComponent } from '../credentials/credentials.component';
import { CredentialEditComponent } from '../credential-edit/credential-edit.component';
import { NotesComponent } from '../notes/notes.component';
import { NoteEditComponent } from '../note-edit/note-edit.component';
import { PasswordGeneratorComponent } from '../password-generator/password-generator.component';
import { MasterPasswordComponent } from '../master-password/master-password.component';

const routes: Routes = [{
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
        { path: 'wallet', component: WalletComponent },
        { path: 'wallet\/:id/type\/:type', component: WalletEditComponent },
        { path: 'credentials', component: CredentialsComponent },
        { path: 'credentials\/:id', component: CredentialEditComponent },
        { path: 'notes', component: NotesComponent },
        { path: 'notes\/:id', component: NoteEditComponent },
        { path: 'password-generator', component: PasswordGeneratorComponent},
        { path: 'master-password', component: MasterPasswordComponent, pathMatch: 'full'},
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DefaultRoutingModule { }
