import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ScanningPage extends BasePage {
  readonly url = '/scanning';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Scanning your transactions...');
  }

  get progressBar(): Locator {
    return this.page.getByTestId('scan-progress-bar');
  }

  get estimatedTime(): Locator {
    return this.page.getByText(/less than 2 minutes/i);
  }

  get transactionsScanned(): Locator {
    return this.page.getByTestId('transactions-scanned');
  }

  get subscriptionsFound(): Locator {
    return this.page.getByTestId('subscriptions-found');
  }

  get completionPercentage(): Locator {
    return this.page.getByTestId('completion-percentage');
  }
}
