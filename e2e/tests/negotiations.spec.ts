import { test, expect } from '@playwright/test';
import { NegotiationLogPage } from '../page-objects/NegotiationLogPage';
import { NEGOTIATIONS } from '../fixtures/test-data';

test.describe('Negotiation Log Screen', () => {
  let page: NegotiationLogPage;

  test.beforeEach(async ({ page: p }) => {
    page = new NegotiationLogPage(p);
    await page.navigate();
  });

  test.describe('Header & Stats', () => {
    test('displays Negotiations heading', async () => {
      await page.expectVisible(page.heading);
    });

    test('shows total negotiations stat card', async () => {
      await page.expectVisible(page.totalNegotiationsCard);
    });

    test('shows success rate stat card', async () => {
      await page.expectVisible(page.successRateCard);
    });

    test('shows total saved stat card', async () => {
      await page.expectVisible(page.totalSavedCard);
    });
  });

  test.describe('Negotiation History List', () => {
    test('displays negotiation rows', async () => {
      await expect(page.negotiationRows).not.toHaveCount(0);
    });

    test('each row shows provider name', async () => {
      const row = page.getNegotiationRow('Verizon Wireless');
      await page.expectVisible(row);
    });

    test('each row shows original rate', async () => {
      const rate = page.getNegotiationOriginalRate('Verizon Wireless');
      await page.expectVisible(rate);
    });

    test('each row shows new rate', async () => {
      const rate = page.getNegotiationNewRate('Verizon Wireless');
      await page.expectVisible(rate);
    });

    test('successful negotiations show success badge', async () => {
      const badge = page.getNegotiationOutcome('Verizon Wireless');
      await page.expectVisible(badge);
    });

    test('failed negotiations show failed badge', async () => {
      const badge = page.getNegotiationOutcome('AT&T Internet');
      await page.expectVisible(badge);
    });
  });

  test.describe('Negotiation Detail', () => {
    test('clicking a row opens detail panel', async () => {
      await page.openDetail('Verizon Wireless');
      await page.expectVisible(page.detailPanel);
    });

    test('detail shows transcript summary', async () => {
      await page.openDetail('Verizon Wireless');
      await page.expectVisible(page.detailTranscript);
    });
  });
});
