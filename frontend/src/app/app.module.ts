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
import { MainTranslateModule } from './main-translate/main-translate.module';
import { KeycloakInitModule } from './init/keycloak-init.module';
import { DefaultRoutingModule } from './auth/pages/default/default-routing.module';
import { DefaultComponent } from './auth/pages/default/default.component';
import { WalletComponent } from './auth/pages/wallet/wallet.component';
import { CredentialsComponent } from './auth/pages/credentials/credentials.component';

@NgModule({
    declarations: [
        AppComponent,
        DefaultComponent,
        WalletComponent,
        CredentialsComponent,
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
        DefaultRoutingModule,
        MainTranslateModule,
        KeycloakInitModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
