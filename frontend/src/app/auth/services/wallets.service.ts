import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeEnum, Wallet } from '../models';
import { BasicService } from './basic.service';

@Injectable({
    providedIn: 'root'
})
export class WalletsService extends BasicService<Wallet> {
    baseApi(): string {
        return "wallets";
    }

    public getByIdAndType(id: number): Observable<Wallet> {
        return this.http.get<Wallet>(`${this.getBaseUrl}/${id}`);
    }

    public save(wallet: Wallet): Observable<Wallet> {
        return this.http.post<Wallet>(`${this.getBaseUrl}/`, wallet);
    }

    public update(wallet: Wallet): Observable<Wallet> {
        return this.http.put<Wallet>(`${this.getBaseUrl}/`, wallet);
    }

    public delete(id: number): Observable<Wallet> {
        return this.http.delete<Wallet>(`${this.getBaseUrl}/${id}`);
    }
}
