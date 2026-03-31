import { test, expect } from '@playwright/test';
import { DashboardPage } from '../page-objects/DashboardPage';
import { DASHBOARD_METRICS, PENDING_ACTIONS } from '../fixtures/test-data';

test.describe('Dashboard Screen', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.navigate();
  });

  test.describe('Header & Summary', () => {
    test('displays Dashboard heading', async () => {
      await dashboard.expectVisible(dashboard.heading);
    });

    test('shows welcome message with user name', async () => {
      await dashboard.expectVisible(dashboard.welcomeMessage);
    });
  });

  test.describe('Metric Cards', () => {
    test('displays monthly recurring spend card', async () => {
      await dashboard.expectVisible(dashboard.monthlyRecurringCard);
    });

    test('displays savings found card', async () => {
      await dashboard.expectVisible(dashboard.savingsFoundCard);
    });

    test('displays savings achieved card', async () => {
      await dashboard.expectVisible(dashboard.savingsAchievedCard);
    });

    test('metric cards show trend indicators', async () => {
      const trend = dashboard.getMetricTrend('metric-monthly-recurring');
      await dashboard.expectVisible(trend);
    });

    test('metric cards stack on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await dashboard.navigate();
      await dashboard.expectVisible(dashboard.monthlyRecurringCard);
      await dashboard.expectVisible(dashboard.savingsFoundCard);
    });
  });

  test.describe('Savings Chart', () => {
    test('displays savings chart widget', async () => {
      await dashboard.expectVisible(dashboard.savingsChart);
    });

    test('shows time period toggle buttons', async () => {
      await dashboard.expectVisible(dashboard.chartToggle6M);
      await dashboard.expectVisible(dashboard.chartToggle1Y);
      await dashboard.expectVisible(dashboard.chartToggleAll);
    });
  });

  test.describe('Pending Actions Preview', () => {
    test('displays pending actions section', async () => {
      await dashboard.expectVisible(dashboard.pendingActionsSection);
    });

    test('shows View All link', async () => {
      await dashboard.expectVisible(dashboard.viewAllActionsLink);
    });

    test('shows pending action items with approve buttons', async () => {
      const action = dashboard.getPendingAction(PENDING_ACTIONS[0].name);
      await dashboard.expectVisible(action);
    });
  });

  test.describe('Activity Feed', () => {
    test('displays activity feed', async () => {
      await dashboard.expectVisible(dashboard.activityFeed);
    });

    test('shows activity items with timestamps', async () => {
      const items = dashboard.activityItems;
      await expect(items).not.toHaveCount(0);
    });
  });

  test.describe('Navigation', () => {
    test('desktop shows sidebar navigation', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await dashboard.navigate();
      await dashboard.expectVisible(dashboard.sidebar);
    });

    test('mobile shows bottom tab bar', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await dashboard.navigate();
      await dashboard.expectVisible(dashboard.bottomTabs);
    });

    test('shows notification bell with badge', async () => {
      await dashboard.expectVisible(dashboard.notificationBell);
    });

    test('shows user avatar', async () => {
      await dashboard.expectVisible(dashboard.userAvatar);
    });
  });
});
