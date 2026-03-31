import { type Page, type Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async expectText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async clickAndWait(locator: Locator): Promise<void> {
    await locator.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Sidebar nav (desktop) */
  get sidebar(): Locator {
    return this.page.getByTestId('sidebar');
  }

  /** Bottom tab bar (mobile) */
  get bottomTabs(): Locator {
    return this.page.getByTestId('bottom-tabs');
  }

  /** Notification bell */
  get notificationBell(): Locator {
    return this.page.getByTestId('notification-bell');
  }

  /** User avatar */
  get userAvatar(): Locator {
    return this.page.getByTestId('user-avatar');
  }

  async navigateViaNav(label: string): Promise<void> {
    const navItem = this.page.getByRole('link', { name: label });
    await navItem.click();
    await this.page.waitForLoadState('networkidle');
  }
}
