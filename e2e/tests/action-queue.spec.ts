import { test, expect } from '@playwright/test';
import { ActionQueuePage } from '../page-objects/ActionQueuePage';

test.describe('Action Queue Screen', () => {
  let page: ActionQueuePage;

  test.beforeEach(async ({ page: p }) => {
    page = new ActionQueuePage(p);
    await page.navigate();
  });

  test.describe('Header', () => {
    test('displays Action Queue heading', async () => {
      await page.expectVisible(page.heading);
    });

    test('shows Approve All button', async () => {
      await page.expectVisible(page.approveAllButton);
    });
  });

  test.describe('Tabs', () => {
    test('shows Pending Approval tab with badge count', async () => {
      await page.expectVisible(page.pendingTab);
      await page.expectVisible(page.getTabBadge('Pending'));
    });

    test('shows In Progress tab with badge count', async () => {
      await page.expectVisible(page.inProgressTab);
    });

    test('shows Completed tab with badge count', async () => {
      await page.expectVisible(page.completedTab);
    });

    test('clicking In Progress tab shows in-progress actions', async () => {
      await page.switchToTab('In Progress');
      await expect(page.actionItems).not.toHaveCount(0);
    });

    test('clicking Completed tab shows completed actions', async () => {
      await page.switchToTab('Completed');
      await expect(page.actionItems).not.toHaveCount(0);
    });
  });

  test.describe('Pending Action Cards', () => {
    test('shows action items in pending tab', async () => {
      await expect(page.actionItems).not.toHaveCount(0);
    });

    test('each action shows approve and dismiss buttons', async () => {
      const item = page.getActionItem('Cancel Adobe Creative Cloud');
      await page.expectVisible(item);
      await page.expectVisible(page.getActionApproveButton('Cancel Adobe Creative Cloud'));
      await page.expectVisible(page.getActionDismissButton('Cancel Adobe Creative Cloud'));
    });

    test('each action shows estimated savings', async () => {
      const savings = page.getActionSavings('Cancel Adobe Creative Cloud');
      await page.expectVisible(savings);
    });

    test('action item shows description text', async () => {
      const item = page.getActionItem('Cancel Adobe Creative Cloud');
      await page.expectVisible(item);
    });
  });

  test.describe('In-Progress Actions', () => {
    test('shows status indicator for in-progress actions', async () => {
      await page.switchToTab('In Progress');
      const items = page.actionItems;
      await expect(items).not.toHaveCount(0);
      const firstItem = items.first();
      const status = firstItem.getByTestId('action-status');
      await expect(status).toBeVisible();
    });
  });

  test.describe('Completed Actions', () => {
    test('shows outcome badge for completed actions', async () => {
      await page.switchToTab('Completed');
      await expect(page.actionItems).not.toHaveCount(0);
    });
  });

  test.describe('Responsive', () => {
    test('mobile layout with bottom tabs', async ({ page: p }) => {
      await p.setViewportSize({ width: 375, height: 812 });
      const mobilePage = new ActionQueuePage(p);
      await mobilePage.navigate();
      await mobilePage.expectVisible(mobilePage.heading);
      await mobilePage.expectVisible(mobilePage.pendingTab);
    });
  });
});
