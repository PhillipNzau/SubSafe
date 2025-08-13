import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter, :leave', [animate('0.2s ease-in-out')]),
    ]),
  ],
})
export class Modal {
  @Input() showModal = false;
  @Input() width: string = 'auto';
  @Input() borderColor: string = 'auto';
  @Input() justifyTop: string = 'top';

  @Output() backdropClick = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.backdropClick.emit();
    }
  }
}
