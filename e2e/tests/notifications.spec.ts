import { test, expect } from '@playwright/test';
import { NotificationsPage } from '../page-objects/NotificationsPage';

test.describe('Notifications Screen', () => {
  let page: NotificationsPage;

  test.beforeEach(async ({ page: p }) => {
    page = new NotificationsPage(p);
    await page.navigate();
  });

  test.describe('Header', () => {
    test('displays Notifications heading', async () => {
      await page.expectVisible(page.heading);
    });
  });

  test.describe('Alert Banners', () => {
    test('shows contextual alert banner', async () => {
      await page.expectVisible(page.alertBanner);
    });

    test('alert banner shows action text', async () => {
      await page.expectVisible(page.alertBannerText);
    });

    test('alert banner has Negotiate button', async () => {
      await page.expectVisible(page.alertNegotiateButton);
    });

    test('alert banner has Dismiss button', async () => {
      await page.expectVisible(page.alertDismissButton);
    });

    test('dismissing alert removes it', async () => {
      await page.dismissAlert();
      await expect(page.alertBanner).not.toBeVisible();
    });
  });

  test.describe('Notification Items', () => {
    test('displays notification items', async () => {
      await expect(page.notificationItems).not.toHaveCount(0);
    });

    test('shows date group headers', async () => {
      await page.expectVisible(page.todayGroup);
    });

    test('shows Price Increase Detected notification', async () => {
      const notification = page.getNotification('Price Increase Detected');
      await page.expectVisible(notification);
    });

    test('shows Negotiation Successful notification', async () => {
      const notification = page.getNotification('Negotiation Successful');
      await page.expectVisible(notification);
    });

    test('unread notifications show indicator dot', async () => {
      const dot = page.getNotificationUnreadDot('Price Increase Detected');
      await page.expectVisible(dot);
    });

    test('shows Free Trial Ending notification', async () => {
      const notification = page.getNotification('Free Trial Ending');
      await page.expectVisible(notification);
    });
  });

  test.describe('Monthly Report Card', () => {
    test('displays monthly report card', async () => {
      await page.expectVisible(page.monthlyReport);
    });

    test('report shows saved amount', async () => {
      await page.expectVisible(page.reportSavedAmount);
    });

    test('report shows actions taken count', async () => {
      await page.expectVisible(page.reportActionsTaken);
    });

    test('report has Share button', async () => {
      await page.expectVisible(page.reportShareButton);
    });
  });

  test.describe('Responsive', () => {
    test('mobile layout renders correctly', async ({ page: p }) => {
      await p.setViewportSize({ width: 375, height: 812 });
      const mobilePage = new NotificationsPage(p);
      await mobilePage.navigate();
      await mobilePage.expectVisible(mobilePage.heading);
    });
  });
});
