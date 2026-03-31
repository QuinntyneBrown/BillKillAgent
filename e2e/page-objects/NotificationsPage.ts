import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NotificationsPage extends BasePage {
  readonly url = '/notifications';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Notifications');
  }

  // Alert banner
  get alertBanner(): Locator {
    return this.page.getByTestId('alert-banner');
  }

  get alertBannerText(): Locator {
    return this.alertBanner.getByTestId('alert-text');
  }

  get alertNegotiateButton(): Locator {
    return this.alertBanner.getByRole('button', { name: /negotiate/i });
  }

  get alertDismissButton(): Locator {
    return this.alertBanner.getByRole('button', { name: /dismiss/i });
  }

  // Notification items
  get notificationItems(): Locator {
    return this.page.getByTestId('notification-item');
  }

  getNotification(title: string): Locator {
    return this.notificationItems.filter({ hasText: title });
  }

  getNotificationUnreadDot(title: string): Locator {
    return this.getNotification(title).getByTestId('unread-dot');
  }

  // Monthly report card
  get monthlyReport(): Locator {
    return this.page.getByTestId('monthly-report');
  }

  get reportSavedAmount(): Locator {
    return this.monthlyReport.getByTestId('report-saved');
  }

  get reportActionsTaken(): Locator {
    return this.monthlyReport.getByTestId('report-actions');
  }

  get reportShareButton(): Locator {
    return this.monthlyReport.getByRole('button', { name: /share/i });
  }

  // Date groups
  get todayGroup(): Locator {
    return this.page.getByText('Today');
  }

  async dismissAlert(): Promise<void> {
    await this.alertDismissButton.click();
  }

  async clickAlertAction(): Promise<void> {
    await this.alertNegotiateButton.click();
  }
}
