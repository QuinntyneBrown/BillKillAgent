import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ActionApprovalPage extends BasePage {
  readonly url = '/approve';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Review Recommended Actions');
  }

  get subtitle(): Locator {
    return this.page.getByText(/approve the actions you'd like us to take/i);
  }

  get approveAllButton(): Locator {
    return this.page.getByRole('button', { name: /approve all/i });
  }

  get actionsCount(): Locator {
    return this.page.getByTestId('actions-count');
  }

  get cancelSection(): Locator {
    return this.page.getByTestId('cancel-section');
  }

  get negotiateSection(): Locator {
    return this.page.getByTestId('negotiate-section');
  }

  getActionToggle(subscriptionName: string): Locator {
    return this.page
      .locator(`[data-testid="action-row"]`)
      .filter({ hasText: subscriptionName })
      .getByRole('switch');
  }

  getActionSavings(subscriptionName: string): Locator {
    return this.page
      .locator(`[data-testid="action-row"]`)
      .filter({ hasText: subscriptionName })
      .getByTestId('estimated-savings');
  }

  async approveAll(): Promise<void> {
    await this.approveAllButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async toggleAction(subscriptionName: string): Promise<void> {
    await this.getActionToggle(subscriptionName).click();
  }
}
