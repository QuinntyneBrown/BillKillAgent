import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SavingsTrackerPage extends BasePage {
  readonly url = '/savings';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Savings Tracker');
  }

  get lifetimeSavings(): Locator {
    return this.page.getByTestId('lifetime-savings');
  }

  get savingsDestination(): Locator {
    return this.page.getByTestId('savings-destination');
  }

  // Chart
  get savingsChart(): Locator {
    return this.page.getByTestId('cumulative-savings-chart');
  }

  get achievedToggle(): Locator {
    return this.page.getByRole('button', { name: /achieved/i });
  }

  get projectedToggle(): Locator {
    return this.page.getByRole('button', { name: /projected/i });
  }

  // Category breakdown
  get categoryBreakdown(): Locator {
    return this.page.getByTestId('category-breakdown');
  }

  getCategoryRow(name: string): Locator {
    return this.categoryBreakdown.locator(`[data-testid="category-row"]`).filter({ hasText: name });
  }

  getCategoryAmount(name: string): Locator {
    return this.getCategoryRow(name).getByTestId('category-amount');
  }

  // Transfer history
  get transferHistory(): Locator {
    return this.page.getByTestId('transfer-history');
  }

  get transferRows(): Locator {
    return this.transferHistory.getByTestId('transfer-row');
  }

  // Monthly/Annual breakdown
  get monthlySavings(): Locator {
    return this.page.getByTestId('monthly-savings');
  }

  get annualSavings(): Locator {
    return this.page.getByTestId('annual-savings');
  }
}
