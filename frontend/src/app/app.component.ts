import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    private loadState: Subscription;
    public isLoading!: boolean;

    constructor(public settingsService: SettingsService) {
        // Set default theme
        this.settingsService.setDefalutTheme();

        // Check loading state
        this.loadState = this.settingsService.loadStateChanged().subscribe(data => this.isLoading = data);
    }

    ngOnDestroy(): void {
        this.loadState.unsubscribe();
    }
}
