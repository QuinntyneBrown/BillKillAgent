import { test, expect } from '@playwright/test';
import { SubscriptionsPage } from '../page-objects/SubscriptionsPage';
import { SUBSCRIPTIONS } from '../fixtures/test-data';

test.describe('Subscriptions List Screen', () => {
  let page: SubscriptionsPage;

  test.beforeEach(async ({ page: p }) => {
    page = new SubscriptionsPage(p);
    await page.navigate();
  });

  test.describe('Header & Filters', () => {
    test('displays Subscriptions heading', async () => {
      await page.expectVisible(page.heading);
    });

    test('shows total subscription count', async () => {
      await page.expectVisible(page.totalCount);
    });

    test('shows search input', async () => {
      await page.expectVisible(page.searchInput);
    });

    test('shows filter chips for categories', async () => {
      await page.expectVisible(page.filterAll);
      await page.expectVisible(page.getFilterChip('Streaming'));
      await page.expectVisible(page.getFilterChip('Software'));
      await page.expectVisible(page.getFilterChip('Utilities'));
    });

    test('shows Flagged filter with count', async () => {
      await page.expectVisible(page.getFilterChip('Flagged'));
    });
  });

  test.describe('Subscription Table', () => {
    test('shows table headers (SERVICE, COST, USAGE, VALUE, ACTION)', async () => {
      await page.expectVisible(page.tableHeader);
    });

    test('displays subscription rows', async () => {
      await expect(page.subscriptionRows).not.toHaveCount(0);
    });

    test('each row shows subscription name and category', async () => {
      const row = page.getSubscriptionRow('Netflix Premium');
      await page.expectVisible(row);
    });

    test('each row shows monthly cost', async () => {
      const cost = page.getSubscriptionCost('Netflix Premium');
      await page.expectVisible(cost);
    });

    test('each row shows usage bar', async () => {
      const usage = page.getSubscriptionUsageBar('Netflix Premium');
      await page.expectVisible(usage);
    });

    test('each row shows value score', async () => {
      const score = page.getSubscriptionValueScore('Netflix Premium');
      await page.expectVisible(score);
    });

    test('each row shows action badge (Keep/Cancel/Negotiate)', async () => {
      const badge = page.getSubscriptionActionBadge('Netflix Premium');
      await page.expectVisible(badge);
    });

    test('flagged subscriptions have distinct border style', async () => {
      const flagged = page.getSubscriptionRow('Adobe Creative Cloud');
      await page.expectVisible(flagged);
    });
  });

  test.describe('Search & Filter', () => {
    test('search filters subscription list', async () => {
      await page.searchFor('Netflix');
      await expect(page.getSubscriptionRow('Netflix Premium')).toBeVisible();
    });

    test('category filter reduces visible rows', async () => {
      await page.filterByCategory('Streaming');
      await expect(page.getSubscriptionRow('Netflix Premium')).toBeVisible();
    });
  });

  test.describe('Subscription Detail', () => {
    test('clicking a row opens detail view', async () => {
      await page.openDetail('Netflix Premium');
      await page.expectVisible(page.detailPanel);
    });

    test('detail view shows usage history', async () => {
      await page.openDetail('Netflix Premium');
      await page.expectVisible(page.detailUsageHistory);
    });

    test('detail view shows action buttons', async () => {
      await page.openDetail('Adobe Creative Cloud');
      await page.expectVisible(page.detailCancelButton);
    });
  });

  test.describe('Responsive Layout', () => {
    test('shows stacked list on mobile', async ({ page: p }) => {
      await p.setViewportSize({ width: 375, height: 812 });
      const mobilePage = new SubscriptionsPage(p);
      await mobilePage.navigate();
      await mobilePage.expectVisible(mobilePage.heading);
      await expect(mobilePage.subscriptionRows).not.toHaveCount(0);
    });
  });
});
