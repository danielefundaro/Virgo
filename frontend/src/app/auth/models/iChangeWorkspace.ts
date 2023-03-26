import { Workspace } from "./workspace.model";

export interface IChangeWorkspaceRequest {
    title: string;
    workspace: Workspace;
}