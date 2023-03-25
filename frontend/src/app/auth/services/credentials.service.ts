import { Injectable } from '@angular/core';
import { Credential } from '../models';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class CredentialsService extends CommonService<Credential> {

    baseApi(): string {
        return "credentials";
    }
}
