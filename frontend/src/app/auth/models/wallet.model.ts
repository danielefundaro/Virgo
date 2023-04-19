import { EncryptCommonFields } from "./encryptCommonFields.model";

export enum TypeEnum {
    CREDENTIAL = "CREDENTIAL",
    NOTE = "NOTE",
}

export class Wallet extends EncryptCommonFields {
    type!: TypeEnum;
    website!: string;
    username!: string;
    passwd!: string;
    content!: string;
    note?: string;
}

export class WalletBasic {
    id!: number;
    type!: TypeEnum;
    info!: string;
    salt!: string;
    iv!: string;
}