import { test, expect } from '@playwright/test';
import { SettingsPage } from '../page-objects/SettingsPage';
import { SETTINGS } from '../fixtures/test-data';

test.describe('Settings Screen', () => {
  let page: SettingsPage;

  test.beforeEach(async ({ page: p }) => {
    page = new SettingsPage(p);
    await page.navigate();
  });

  test.describe('Header', () => {
    test('displays Settings heading', async () => {
      await page.expectVisible(page.heading);
    });
  });

  test.describe('Connected Accounts', () => {
    test('shows connected accounts section', async () => {
      await page.expectVisible(page.connectedAccountsSection);
    });

    test('shows Add Account button', async () => {
      await page.expectVisible(page.addAccountButton);
    });

    test('displays connected bank accounts', async () => {
      for (const account of SETTINGS.accounts) {
        const row = page.getAccountRow(account.name);
        await page.expectVisible(row);
      }
    });

    test('shows connection status indicator', async () => {
      const status = page.getAccountStatus(SETTINGS.accounts[0].name);
      await page.expectVisible(status);
    });
  });

  test.describe('Autonomy Level', () => {
    test('shows autonomy level section', async () => {
      await page.expectVisible(page.autonomySection);
    });

    test('shows all three autonomy options', async () => {
      await page.expectVisible(page.supervisedOption);
      await page.expectVisible(page.semiAutonomousOption);
      await page.expectVisible(page.fullyAutonomousOption);
    });

    test('Supervised is selected by default', async () => {
      await expect(page.supervisedOption).toHaveAttribute('data-selected', 'true');
    });

    test('can change autonomy level', async () => {
      await page.selectAutonomyLevel('semi');
      await expect(page.semiAutonomousOption).toHaveAttribute('data-selected', 'true');
    });
  });

  test.describe('Notification Preferences', () => {
    test('shows notifications section', async () => {
      await page.expectVisible(page.notificationsSection);
    });

    test('shows toggle for Push Notifications', async () => {
      await page.expectVisible(page.getNotificationToggle('Push Notifications'));
    });

    test('shows toggle for Email Digests', async () => {
      await page.expectVisible(page.getNotificationToggle('Email Digests'));
    });

    test('shows toggle for Price Increase Alerts', async () => {
      await page.expectVisible(page.getNotificationToggle('Price Increase Alerts'));
    });

    test('shows toggle for Monthly Report', async () => {
      await page.expectVisible(page.getNotificationToggle('Monthly Report'));
    });
  });

  test.describe('Savings Destination', () => {
    test('shows savings destination section', async () => {
      await page.expectVisible(page.savingsDestinationSection);
    });

    test('shows Change button', async () => {
      await page.expectVisible(page.changeDestinationButton);
    });

    test('shows auto-transfer toggle', async () => {
      await page.expectVisible(page.autoTransferToggle);
    });
  });

  test.describe('Profile', () => {
    test('shows profile section', async () => {
      await page.expectVisible(page.profileSection);
    });

    test('displays user name', async () => {
      await page.expectVisible(page.userName);
    });

    test('displays user email', async () => {
      await page.expectVisible(page.userEmail);
    });

    test('shows Change Password link', async () => {
      await page.expectVisible(page.changePasswordLink);
    });

    test('shows Log Out link', async () => {
      await page.expectVisible(page.logoutLink);
    });

    test('shows Delete Account link', async () => {
      await page.expectVisible(page.deleteAccountLink);
    });
  });

  test.describe('Responsive', () => {
    test('mobile shows stacked sections', async ({ page: p }) => {
      await p.setViewportSize({ width: 375, height: 812 });
      const mobilePage = new SettingsPage(p);
      await mobilePage.navigate();
      await mobilePage.expectVisible(mobilePage.autonomySection);
      await mobilePage.expectVisible(mobilePage.notificationsSection);
    });
  });
});
