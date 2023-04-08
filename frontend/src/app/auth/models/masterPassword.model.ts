export enum MasterPasswordEnum {
    FIRST_INSERT = "first-insert",
    VALIDATE = "validate",
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