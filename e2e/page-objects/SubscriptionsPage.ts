import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SubscriptionsPage extends BasePage {
  readonly url = '/subscriptions';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Subscriptions');
  }

  get totalCount(): Locator {
    return this.page.getByTestId('subscription-count');
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder(/search subscriptions/i);
  }

  // Filter chips
  get filterAll(): Locator {
    return this.page.getByRole('button', { name: /all/i });
  }

  getFilterChip(label: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(label, 'i') });
  }

  // Table headers
  get tableHeader(): Locator {
    return this.page.getByTestId('subscription-table-header');
  }

  // Subscription rows
  get subscriptionRows(): Locator {
    return this.page.getByTestId('subscription-row');
  }

  getSubscriptionRow(name: string): Locator {
    return this.subscriptionRows.filter({ hasText: name });
  }

  getSubscriptionCost(name: string): Locator {
    return this.getSubscriptionRow(name).getByTestId('subscription-cost');
  }

  getSubscriptionUsageBar(name: string): Locator {
    return this.getSubscriptionRow(name).getByTestId('usage-bar');
  }

  getSubscriptionValueScore(name: string): Locator {
    return this.getSubscriptionRow(name).getByTestId('value-score');
  }

  getSubscriptionActionBadge(name: string): Locator {
    return this.getSubscriptionRow(name).getByTestId('action-badge');
  }

  // Detail view
  get detailPanel(): Locator {
    return this.page.getByTestId('subscription-detail');
  }

  get detailUsageHistory(): Locator {
    return this.detailPanel.getByTestId('usage-history');
  }

  get detailCancelButton(): Locator {
    return this.detailPanel.getByRole('button', { name: /cancel/i });
  }

  get detailNegotiateButton(): Locator {
    return this.detailPanel.getByRole('button', { name: /negotiate/i });
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async filterByCategory(category: string): Promise<void> {
    await this.getFilterChip(category).click();
  }

  async openDetail(name: string): Promise<void> {
    await this.getSubscriptionRow(name).click();
  }
}
