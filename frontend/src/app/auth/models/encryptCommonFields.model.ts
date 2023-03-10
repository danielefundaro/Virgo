import { Workspace } from "./workspace.model";

export class EncryptCommonFields {
    salt!: string;
    iv!: string;
    workspace?: Workspace;
}