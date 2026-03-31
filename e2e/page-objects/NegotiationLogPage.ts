import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NegotiationLogPage extends BasePage {
  readonly url = '/negotiations';

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText('Negotiations');
  }

  // Stats cards
  get totalNegotiationsCard(): Locator {
    return this.page.getByTestId('stat-total-negotiations');
  }

  get successRateCard(): Locator {
    return this.page.getByTestId('stat-success-rate');
  }

  get totalSavedCard(): Locator {
    return this.page.getByTestId('stat-total-saved');
  }

  // Negotiation rows
  get negotiationRows(): Locator {
    return this.page.getByTestId('negotiation-row');
  }

  getNegotiationRow(provider: string): Locator {
    return this.negotiationRows.filter({ hasText: provider });
  }

  getNegotiationOriginalRate(provider: string): Locator {
    return this.getNegotiationRow(provider).getByTestId('original-rate');
  }

  getNegotiationNewRate(provider: string): Locator {
    return this.getNegotiationRow(provider).getByTestId('new-rate');
  }

  getNegotiationOutcome(provider: string): Locator {
    return this.getNegotiationRow(provider).getByTestId('outcome-badge');
  }

  // Detail view
  get detailPanel(): Locator {
    return this.page.getByTestId('negotiation-detail');
  }

  get detailTranscript(): Locator {
    return this.detailPanel.getByTestId('transcript');
  }

  async openDetail(provider: string): Promise<void> {
    await this.getNegotiationRow(provider).click();
  }
}
