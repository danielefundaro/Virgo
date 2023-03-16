import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Wallet } from '../models';
import { BasicService } from './basic.service';

@Injectable({
    providedIn: 'root'
})
export class WalletsService extends BasicService<Wallet> {
    baseApi(): string {
        return "wallets";
    }

    public getByIdAndType(id: number, type: string): Observable<Wallet> {
        return this.http.get<Wallet>(`${this.getBaseUrl}/${id}/type/${type}`);
    }
}
