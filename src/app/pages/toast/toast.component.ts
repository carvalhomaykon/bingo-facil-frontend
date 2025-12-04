import { Component, OnInit } from '@angular/core';
import { NotificationService, Toast } from '../../services/notification/notification.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit{

  currentToast: Toast | null = null;
  private timeoutId: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.toast$.subscribe(toast => {
      this.showToast(toast);
    });
  }

  showToast(toast: Toast) {
    clearTimeout(this.timeoutId);

    this.currentToast = toast;

    this.timeoutId = setTimeout(() => {
      this.currentToast = null;
    }, 4000);
  }

  getIcon(type: Toast['type']): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }

  getToastClasses(type: Toast['type']): string {
    switch (type) {
      case 'success': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-400 text-gray-800';
      default: return 'bg-blue-500 text-white';
    }
  }

}
