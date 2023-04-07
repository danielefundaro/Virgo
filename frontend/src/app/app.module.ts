import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MainTranslateModule } from './main-translate/main-translate.module';
import { KeycloakInitModule } from './init/keycloak-init.module';
import { DefaultRoutingModule } from './auth/pages/default/default-routing.module';
import { DefaultComponent } from './auth/pages/default/default.component';
import { CustomTableComponent } from './auth/components/custom-table/custom-table.component';
import { WalletComponent } from './auth/pages/wallet/wallet.component';
import { CredentialsComponent } from './auth/pages/credentials/credentials.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { NotesComponent } from './auth/pages/notes/notes.component';
import { ChangeWorkspaceComponent } from './auth/components/dialog/change-workspace/change-workspace.component';
import { CredentialEditComponent } from './auth/pages/credential-edit/credential-edit.component';
import { NoteEditComponent } from './auth/pages/note-edit/note-edit.component';
import { WalletEditComponent } from './auth/pages/wallet-edit/wallet-edit.component';
import { ConfirmActionComponent } from './auth/components/dialog/confirm-action/confirm-action.component';
import { MassiveActionsComponent } from './auth/components/massive-actions/massive-actions.component';
import { PasswordGeneratorComponent } from './auth/pages/password-generator/password-generator.component';
import { AddWorkspaceComponent } from './auth/components/dialog/add-workspace/add-workspace.component';
import { LoadingSpinnerComponent } from './auth/components/loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [
        AppComponent,
        DefaultComponent,
        WalletComponent,
        CredentialsComponent,
        TruncatePipe,
        NotesComponent,
        CustomTableComponent,
        ChangeWorkspaceComponent,
        CredentialEditComponent,
        NoteEditComponent,
        WalletEditComponent,
        ConfirmActionComponent,
        MassiveActionsComponent,
        PasswordGeneratorComponent,
        AddWorkspaceComponent,
        LoadingSpinnerComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatSidenavModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatListModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatInputModule,
        MatPaginatorModule,
        ClipboardModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatExpansionModule,
        MatProgressBarModule,
        DefaultRoutingModule,
        MainTranslateModule,
        KeycloakInitModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
