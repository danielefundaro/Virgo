import { Workspace } from "./workspace.model";

export interface IChangeWorkspaceRequest {
    title: string;
    workspace: Workspace;
}

export interface IChangeWorkspaceResponse {
    move: boolean;
    workspace: Workspace;
}