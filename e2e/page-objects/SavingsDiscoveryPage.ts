import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SavingsDiscoveryPage extends BasePage {
  readonly url = '/discovery';

  constructor(page: Page) {
    super(page);
  }

  get heroSavingsAmount(): Locator {
    return this.page.getByTestId('hero-savings-amount');
  }

  get weFoundLabel(): Locator {
    return this.page.getByText('We found');
  }

  get potentialSavingsLabel(): Locator {
    return this.page.getByText('in potential savings');
  }

  get subscriptionsFoundCard(): Locator {
    return this.page.getByTestId('subscriptions-found-card');
  }

  get wasteDetectedCard(): Locator {
    return this.page.getByTestId('waste-detected-card');
  }

  get negotiationsPossibleCard(): Locator {
    return this.page.getByTestId('negotiations-possible-card');
  }

  get reviewAndSaveButton(): Locator {
    return this.page.getByRole('button', { name: /review & save/i });
  }

  async proceedToReview(): Promise<void> {
    await this.reviewAndSaveButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
