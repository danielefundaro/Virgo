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

    public getByIdAndType(id: number, type: TypeEnum): Observable<Wallet> {
        return this.http.get<Wallet>(`${this.getBaseUrl}/${id}/type/${type.toLowerCase()}`);
    }

    public save(wallet: Wallet, type: TypeEnum): Observable<Wallet> {
        return this.http.post<Wallet>(`${this.getBaseUrl}/type/${type.toLowerCase()}`, wallet);
    }

    public update(wallet: Wallet, type: TypeEnum): Observable<Wallet> {
        return this.http.put<Wallet>(`${this.getBaseUrl}/type/${type.toLowerCase()}`, wallet);
    }

    public delete(id: number, type: TypeEnum): Observable<Wallet> {
        return this.http.delete<Wallet>(`${this.getBaseUrl}/${id}/type/${type.toLowerCase()}`);
    }
}
