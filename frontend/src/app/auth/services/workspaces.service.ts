import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Workspace } from '../models';

@Injectable({
    providedIn: 'root'
})
export class WorkspacesService extends CommonService<Workspace> {
    baseApi(): string {
        return "workspaces";
    }
}
