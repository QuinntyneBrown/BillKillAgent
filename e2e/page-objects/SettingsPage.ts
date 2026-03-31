import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  readonly url = '/settings';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Settings');
  }

  // Connected Accounts
  get connectedAccountsSection(): Locator {
    return this.page.getByTestId('connected-accounts');
  }

  get addAccountButton(): Locator {
    return this.page.getByRole('button', { name: /add account/i });
  }

  getAccountRow(name: string): Locator {
    return this.connectedAccountsSection.locator(`[data-testid="account-row"]`).filter({ hasText: name });
  }

  getAccountStatus(name: string): Locator {
    return this.getAccountRow(name).getByTestId('account-status');
  }

  // Autonomy Level
  get autonomySection(): Locator {
    return this.page.getByTestId('autonomy-section');
  }

  get supervisedOption(): Locator {
    return this.page.getByTestId('autonomy-supervised');
  }

  get semiAutonomousOption(): Locator {
    return this.page.getByTestId('autonomy-semi');
  }

  get fullyAutonomousOption(): Locator {
    return this.page.getByTestId('autonomy-full');
  }

  // Notifications
  get notificationsSection(): Locator {
    return this.page.getByTestId('notifications-section');
  }

  getNotificationToggle(label: string): Locator {
    return this.notificationsSection
      .locator('[data-testid="notification-toggle-row"]')
      .filter({ hasText: label })
      .getByRole('switch');
  }

  // Savings Destination
  get savingsDestinationSection(): Locator {
    return this.page.getByTestId('savings-destination-section');
  }

  get changeDestinationButton(): Locator {
    return this.page.getByRole('button', { name: /change/i });
  }

  get autoTransferToggle(): Locator {
    return this.page.getByTestId('auto-transfer-toggle').getByRole('switch');
  }

  // Profile
  get profileSection(): Locator {
    return this.page.getByTestId('profile-section');
  }

  get userName(): Locator {
    return this.profileSection.getByTestId('user-name');
  }

  get userEmail(): Locator {
    return this.profileSection.getByTestId('user-email');
  }

  get changePasswordLink(): Locator {
    return this.page.getByText('Change Password');
  }

  get logoutLink(): Locator {
    return this.page.getByText('Log Out');
  }

  get deleteAccountLink(): Locator {
    return this.page.getByText('Delete Account');
  }

  async selectAutonomyLevel(level: 'supervised' | 'semi' | 'full'): Promise<void> {
    const option = {
      supervised: this.supervisedOption,
      semi: this.semiAutonomousOption,
      full: this.fullyAutonomousOption,
    }[level];
    await option.click();
  }

  async toggleNotification(label: string): Promise<void> {
    await this.getNotificationToggle(label).click();
  }
}
