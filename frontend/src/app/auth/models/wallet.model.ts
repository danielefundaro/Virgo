import { EncryptCommonFields } from "./encryptCommonFields.model";

export class Wallet extends EncryptCommonFields {
    type!: string;
    website!: string;
    username!: string;
    passwd!: string;
    content!: string;
    note?: string;
}