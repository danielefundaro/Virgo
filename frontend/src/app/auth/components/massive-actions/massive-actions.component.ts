import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'massive-actions',
    templateUrl: './massive-actions.component.html',
    styleUrls: ['./massive-actions.component.scss']
})
export class MassiveActionsComponent {

    @Input() itemSelected!: number;
    @Input() disabled!: boolean;
    @Output() moveEvent: EventEmitter<void> = new EventEmitter();
    @Output() deleteEvent: EventEmitter<void> = new EventEmitter();
    @Output() closeEvent: EventEmitter<void> = new EventEmitter();

    public onMoveEvent(): void {
        this.moveEvent.emit();
    }

    public onDeleteEvent(): void {
        this.deleteEvent.emit();
    }

    public onCloseEvent(): void {
        this.closeEvent.emit();
    }
}
