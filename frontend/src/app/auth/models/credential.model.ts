import { EncryptCommonFields } from "./encryptCommonFields.model";

export class Credential extends EncryptCommonFields {
    website!: string;
    username!: string;
    passwd!: string;
    note?: string;
}