import { Component, Input } from '@angular/core';
import { Dialog } from '../../models/dialog.model';

/**
 * Provide a basic dialog component design for use with information-only
 * or yes/no-style messages.
 */
@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
    @Input() dialog: Dialog;

    constructor() { }

    doAction(action: () => any | null): void {
        // Emit the selected action
        action();
    }
}
