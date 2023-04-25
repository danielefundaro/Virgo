import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SettingsService } from "./settings.service";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class IdleTimerService {

    private timeLeft: number;
    private timeLeft$: Subject<number | null>;
    private timeLeftReset: boolean;

    constructor(private router: Router, private settingsService: SettingsService) {
        this.timeLeft = 0;
        this.timeLeft$ = new Subject<number | null>();
        this.timeLeftReset = true;

        this.newStart();
        this.initListener();
        this.startCheck();
        this.initInterval();
    }

    public finalCountdown(): Observable<number | null> {
        return this.timeLeft$.asObservable();
    }

    private startCheck(): void {
        const timeLeft = (this.timeLeft - Date.now()) / 1000;

        if (timeLeft <= 60) {
            this.timeLeft$.next(Math.ceil(timeLeft));
            this.timeLeftReset = false;

            if (timeLeft <= 0) {
                this.router.navigate(['/master-password']);
                this.timeLeft$.next(null);
                this.timeLeftReset = true;
            }
        } else if (!this.timeLeftReset) {
            this.resetTimer();
        }
    }

    private initListener(): void {
        document.body.addEventListener('click', () => this.newStart());
        document.body.addEventListener('mouseover', () => this.newStart());
        document.body.addEventListener('mouseout', () => this.newStart());
        document.body.addEventListener('keydown', () => this.newStart());
        document.body.addEventListener('keyup', () => this.newStart());
        document.body.addEventListener('keypress', () => this.newStart());
    }

    private newStart(): void {
        this.timeLeft = Date.now() + 20 * 60 * 1000;
    }

    private resetTimer() {
        this.timeLeft$.next(null);
        this.timeLeftReset = true;
    }

    private initInterval(): void {
        setInterval(() => {
            if (window.location.pathname !== '/master-password') {
                this.startCheck();
            }
        }, 1000);
    }
}