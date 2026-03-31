import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly url = '/';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Dashboard' });
  }

  get welcomeMessage(): Locator {
    return this.page.getByTestId('welcome-message');
  }

  // Metric Cards
  get monthlyRecurringCard(): Locator {
    return this.page.getByTestId('metric-monthly-recurring');
  }

  get savingsFoundCard(): Locator {
    return this.page.getByTestId('metric-savings-found');
  }

  get savingsAchievedCard(): Locator {
    return this.page.getByTestId('metric-savings-achieved');
  }

  getMetricValue(testId: string): Locator {
    return this.page.getByTestId(testId).getByTestId('metric-value');
  }

  getMetricTrend(testId: string): Locator {
    return this.page.getByTestId(testId).getByTestId('metric-trend');
  }

  // Savings Chart
  get savingsChart(): Locator {
    return this.page.getByTestId('savings-chart');
  }

  get chartToggle6M(): Locator {
    return this.page.getByRole('button', { name: '6M' });
  }

  get chartToggle1Y(): Locator {
    return this.page.getByRole('button', { name: '1Y' });
  }

  get chartToggleAll(): Locator {
    return this.page.getByRole('button', { name: 'ALL' });
  }

  // Pending Actions
  get pendingActionsSection(): Locator {
    return this.page.getByTestId('pending-actions');
  }

  get viewAllActionsLink(): Locator {
    return this.page.getByRole('link', { name: /view all/i });
  }

  getPendingAction(name: string): Locator {
    return this.pendingActionsSection.locator(`[data-testid="action-preview"]`).filter({ hasText: name });
  }

  getApproveButton(actionName: string): Locator {
    return this.getPendingAction(actionName).getByRole('button', { name: /approve/i });
  }

  // Activity Feed
  get activityFeed(): Locator {
    return this.page.getByTestId('activity-feed');
  }

  get activityItems(): Locator {
    return this.activityFeed.getByTestId('activity-item');
  }

  async approveAction(name: string): Promise<void> {
    await this.getApproveButton(name).click();
  }
}
