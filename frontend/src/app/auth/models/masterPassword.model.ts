import { WalletBasic } from "./wallet.model";

export enum MasterPasswordEnum {
    FIRST_INSERT = "first-insert",
    LOCK = "lock",
    CHANGE = "change"
}

export class MasterPassword {
    hashPasswd!: string;
    salt!: string;

    constructor(hashPasswd: string, salt: string) {
        this.hashPasswd = hashPasswd;
        this.salt = salt;
    }
}

export class MasterPasswordUpdate extends MasterPassword {
    wallet: WalletBasic[];

    constructor(hashPasswd: string, salt: string, wallet: WalletBasic[]) {
        super(hashPasswd, salt);
        this.wallet = wallet;
    }
}