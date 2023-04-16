import { Injectable } from "@angular/core";

type EncryptionPayload = { cipher: string, iv: string, salt: string }
type HashPayload = { hash: string, salt: string }

@Injectable({
    providedIn: 'root'
})
export class CryptographyService {
    private readonly algorithm: AesKeyGenParams;
    private readonly keyUsages: Array<KeyUsage>;
    private readonly shaName: string;

    constructor() {
        // See: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
        if (window.isSecureContext) {
            this.algorithm = { name: "AES-CBC", length: 256 };
            this.keyUsages = ["encrypt", "decrypt"];
            this.shaName = "SHA-256";
        }
        else {
            throw new Error("Impossible to use cryptography service due to non-secured context");
        }
    }

    public salt(): string {
        const salt = this.generateSalt();
        return this.convertStreamToBase64(salt);
    }

    public async hash(value: string, salt: string | null = null): Promise<HashPayload> {
        if (salt == null) {
            salt = this.salt();
        }

        const encodeValue = this.encode(value + salt);
        const hashBuffer: ArrayBuffer = await window.crypto.subtle.digest(this.shaName, encodeValue);

        return { hash: this.convertStreamToBase64(hashBuffer), salt };
    }

    public encrypt = async (data: string, key: string, iv: string | null = null, salt: string | null = null): Promise<EncryptionPayload> => {
        const ivBuffer = iv === null ? this.generateIv() : this.convertBase64ToStream(iv);
        const algo = { ...this.algorithm, iv: ivBuffer };
        const passwd = await this.hash(key, salt);
        const keyBuffer = this.convertBase64ToStream(passwd.hash);
        const cryptoKey = await this.parseKey(keyBuffer);
        const encoded = this.encode(data);
        const cipher = await window.crypto.subtle.encrypt(algo, cryptoKey, encoded);

        return { cipher: this.convertStreamToBase64(cipher), iv: this.convertStreamToBase64(ivBuffer), salt: passwd.salt };
    }

    public decrypt = async (cipherText: string, key: string, iv: string, salt: string): Promise<string> => {
        const passwd = await this.hash(key, salt);
        const keyBuffer = this.convertBase64ToStream(passwd.hash);
        const decryptionKey = await this.parseKey(keyBuffer);

        const cipher = this.convertBase64ToStream(cipherText);
        const ivBuffer = this.convertBase64ToStream<Uint8Array>(iv);

        const algo = { ...this.algorithm, iv: ivBuffer };
        const encoded: ArrayBuffer = await window.crypto.subtle.decrypt(algo, decryptionKey, cipher);

        return this.decode(encoded);
    }

    private convertBase64ToStream = <T extends ArrayBuffer | Uint8Array>(base64: string, mimeType?: string): T => {
        let sanitized = base64;

        if (mimeType) {
            sanitized = sanitized.replace(`data:${mimeType};base64,`, "");
        }

        const bin = window.atob(sanitized);
        const buffer = new ArrayBuffer(bin.length);
        const bufferView = new Uint8Array(buffer);

        for (let i = 0; i < bin.length; i++) {
            bufferView[i] = bin.charCodeAt(i);
        }

        return buffer as T;
    }

    private convertStreamToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
        return window.btoa(new Uint8Array(buffer).reduce((a, b) => a + String.fromCharCode(b), ""));
    }

    private encode = (data: string) => new TextEncoder().encode(data);
    private decode = (buffer: ArrayBuffer) => new TextDecoder().decode(buffer);
    private generateIv = (): Uint8Array => window.crypto.getRandomValues(new Uint8Array(16));
    private generateSalt = (): Uint8Array => window.crypto.getRandomValues(new Uint8Array(32));
    private parseKey = async (key: ArrayBuffer) => window.crypto.subtle.importKey("raw", key, this.algorithm, true, this.keyUsages);
    private readKey = async (key: CryptoKey): Promise<ArrayBuffer> => window.crypto.subtle.exportKey("raw", key);
    private generateKey = async (): Promise<CryptoKey> => window.crypto.subtle.generateKey(this.algorithm, true, this.keyUsages);
}