import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ActionQueuePage extends BasePage {
  readonly url = '/actions';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Action Queue');
  }

  get approveAllButton(): Locator {
    return this.page.getByRole('button', { name: /approve all/i });
  }

  // Tabs
  get pendingTab(): Locator {
    return this.page.getByRole('tab', { name: /pending/i });
  }

  get inProgressTab(): Locator {
    return this.page.getByRole('tab', { name: /in progress/i });
  }

  get completedTab(): Locator {
    return this.page.getByRole('tab', { name: /completed/i });
  }

  getTabBadge(tabName: string): Locator {
    return this.page.getByRole('tab', { name: new RegExp(tabName, 'i') }).getByTestId('tab-badge');
  }

  // Action items
  get actionItems(): Locator {
    return this.page.getByTestId('action-item');
  }

  getActionItem(name: string): Locator {
    return this.actionItems.filter({ hasText: name });
  }

  getActionApproveButton(name: string): Locator {
    return this.getActionItem(name).getByRole('button', { name: /approve/i });
  }

  getActionDismissButton(name: string): Locator {
    return this.getActionItem(name).getByRole('button', { name: /dismiss/i });
  }

  getActionStatus(name: string): Locator {
    return this.getActionItem(name).getByTestId('action-status');
  }

  getActionSavings(name: string): Locator {
    return this.getActionItem(name).getByTestId('action-savings');
  }

  async switchToTab(tabName: string): Promise<void> {
    await this.page.getByRole('tab', { name: new RegExp(tabName, 'i') }).click();
    await this.page.waitForTimeout(300);
  }

  async approveAction(name: string): Promise<void> {
    await this.getActionApproveButton(name).click();
  }

  async dismissAction(name: string): Promise<void> {
    await this.getActionDismissButton(name).click();
  }

  async approveAll(): Promise<void> {
    await this.approveAllButton.click();
  }
}
