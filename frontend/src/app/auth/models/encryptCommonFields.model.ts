import { CommonFields } from "./commonFields.model";
import { Workspace } from "./workspace.model";

export class EncryptCommonFields extends CommonFields {
    salt!: string;
    iv!: string;
    workspace!: Workspace;
}