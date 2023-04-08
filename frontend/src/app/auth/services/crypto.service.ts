import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    public getUUID(): string {
        return crypto.randomUUID().replaceAll("-", "");
    }

    public async getHash(value: string, salt: string): Promise<string> {
        const encodeValue = new TextEncoder().encode(value+salt);
        const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', encodeValue);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');

        return hashHex
    }
}