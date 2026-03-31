import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConnectBankPage extends BasePage {
  readonly url = '/connect';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Connect Your Accounts');
  }

  get securityDescription(): Locator {
    return this.page.getByText(/bank-grade encryption/i);
  }

  get soc2Badge(): Locator {
    return this.page.getByText('SOC 2 Certified');
  }

  get readOnlyBadge(): Locator {
    return this.page.getByText('Read-Only Access');
  }

  get gdprBadge(): Locator {
    return this.page.getByText('GDPR & CCPA');
  }

  get connectPlaidButton(): Locator {
    return this.page.getByRole('button', { name: /connect with plaid/i });
  }

  get supportedInstitutionsText(): Locator {
    return this.page.getByText(/12,000\+ financial institutions/i);
  }

  async connectBank(): Promise<void> {
    await this.connectPlaidButton.click();
  }
}
