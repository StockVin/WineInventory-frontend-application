import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [
    NgIf
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() type: 'success' | 'alert' = 'success';
  @Input() showCloseButton: boolean = true;

  closeNotification(): void {
    this.title = '';
    this.content = '';
    this.type = 'success';
    this.showCloseButton = false;
  }

  getClassTypeNotification(): string {
    return this.type === 'success' ? 'notification-container success' : 'notification-container alert';
  }
}