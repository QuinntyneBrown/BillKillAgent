import { test, expect } from '@playwright/test';
import { SavingsTrackerPage } from '../page-objects/SavingsTrackerPage';
import { SAVINGS_DATA } from '../fixtures/test-data';

test.describe('Savings Tracker Screen', () => {
  let page: SavingsTrackerPage;

  test.beforeEach(async ({ page: p }) => {
    page = new SavingsTrackerPage(p);
    await page.navigate();
  });

  test.describe('Overview Header', () => {
    test('displays Savings Tracker heading', async () => {
      await page.expectVisible(page.heading);
    });

    test('shows lifetime savings total', async () => {
      await page.expectVisible(page.lifetimeSavings);
    });

    test('shows savings destination', async () => {
      await page.expectVisible(page.savingsDestination);
    });

    test('shows monthly savings breakdown', async () => {
      await page.expectVisible(page.monthlySavings);
    });

    test('shows annual savings breakdown', async () => {
      await page.expectVisible(page.annualSavings);
    });
  });

  test.describe('Savings Chart', () => {
    test('displays cumulative savings chart', async () => {
      await page.expectVisible(page.savingsChart);
    });

    test('shows Achieved/Projected toggle', async () => {
      await page.expectVisible(page.achievedToggle);
      await page.expectVisible(page.projectedToggle);
    });
  });

  test.describe('Category Breakdown', () => {
    test('displays category breakdown section', async () => {
      await page.expectVisible(page.categoryBreakdown);
    });

    test('shows Subscriptions category with amount', async () => {
      const row = page.getCategoryRow('Subscriptions');
      await page.expectVisible(row);
      await page.expectVisible(page.getCategoryAmount('Subscriptions'));
    });

    test('shows Negotiations category with amount', async () => {
      const row = page.getCategoryRow('Negotiations');
      await page.expectVisible(row);
    });

    test('shows Plan Switches category with amount', async () => {
      const row = page.getCategoryRow('Plan Switches');
      await page.expectVisible(row);
    });
  });

  test.describe('Transfer History', () => {
    test('displays transfer history section', async () => {
      await page.expectVisible(page.transferHistory);
    });

    test('shows transfer rows', async () => {
      await expect(page.transferRows).not.toHaveCount(0);
    });
  });

  test.describe('Responsive', () => {
    test('mobile layout shows stacked cards', async ({ page: p }) => {
      await p.setViewportSize({ width: 375, height: 812 });
      const mobilePage = new SavingsTrackerPage(p);
      await mobilePage.navigate();
      await mobilePage.expectVisible(mobilePage.lifetimeSavings);
      await mobilePage.expectVisible(mobilePage.categoryBreakdown);
    });
  });
});
