import { Injectable } from '@angular/core';
import { Note } from '../models';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class NotesService extends CommonService<Note> {
    baseApi(): string {
        return "notes";
    }
}
