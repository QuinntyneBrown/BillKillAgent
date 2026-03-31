import { test, expect } from '@playwright/test';
import { WelcomePage } from '../page-objects/WelcomePage';
import { ConnectBankPage } from '../page-objects/ConnectBankPage';
import { ScanningPage } from '../page-objects/ScanningPage';
import { SavingsDiscoveryPage } from '../page-objects/SavingsDiscoveryPage';
import { ActionApprovalPage } from '../page-objects/ActionApprovalPage';

test.describe('Onboarding Flow', () => {
  test.describe('Welcome / Sign Up Screen', () => {
    let page: WelcomePage;

    test.beforeEach(async ({ page: p }) => {
      page = new WelcomePage(p);
      await page.navigate();
    });

    test('displays logo and brand name', async () => {
      await page.expectVisible(page.logo);
    });

    test('displays tagline', async () => {
      await page.expectVisible(page.tagline);
    });

    test('displays subtitle description', async () => {
      await page.expectVisible(page.subtitle);
    });

    test('shows email sign-up button', async () => {
      await page.expectVisible(page.emailSignupButton);
    });

    test('shows Google sign-up button', async () => {
      await page.expectVisible(page.googleButton);
    });

    test('shows Apple sign-up button', async () => {
      await page.expectVisible(page.appleButton);
    });

    test('shows login link for returning users', async () => {
      await page.expectVisible(page.loginLink);
    });

    test('is responsive at mobile viewport', async ({ page: p }) => {
      await p.setViewportSize({ width: 375, height: 812 });
      const mobilePage = new WelcomePage(p);
      await mobilePage.navigate();
      await mobilePage.expectVisible(mobilePage.emailSignupButton);
      await mobilePage.expectVisible(mobilePage.tagline);
    });
  });

  test.describe('Connect Bank Screen', () => {
    let page: ConnectBankPage;

    test.beforeEach(async ({ page: p }) => {
      page = new ConnectBankPage(p);
      await page.navigate();
    });

    test('displays heading', async () => {
      await page.expectVisible(page.heading);
    });

    test('shows security trust signals', async () => {
      await page.expectVisible(page.soc2Badge);
      await page.expectVisible(page.readOnlyBadge);
      await page.expectVisible(page.gdprBadge);
    });

    test('shows Connect with Plaid button', async () => {
      await page.expectVisible(page.connectPlaidButton);
    });

    test('shows supported institutions text', async () => {
      await page.expectVisible(page.supportedInstitutionsText);
    });
  });

  test.describe('Scanning Screen', () => {
    let page: ScanningPage;

    test.beforeEach(async ({ page: p }) => {
      page = new ScanningPage(p);
      await page.navigate();
    });

    test('displays scanning heading', async () => {
      await page.expectVisible(page.heading);
    });

    test('shows progress bar', async () => {
      await page.expectVisible(page.progressBar);
    });

    test('shows estimated time', async () => {
      await page.expectVisible(page.estimatedTime);
    });

    test('shows live scan stats', async () => {
      await page.expectVisible(page.transactionsScanned);
      await page.expectVisible(page.subscriptionsFound);
      await page.expectVisible(page.completionPercentage);
    });
  });

  test.describe('Savings Discovery ("Aha Moment") Screen', () => {
    let page: SavingsDiscoveryPage;

    test.beforeEach(async ({ page: p }) => {
      page = new SavingsDiscoveryPage(p);
      await page.navigate();
    });

    test('displays hero savings amount prominently', async () => {
      await page.expectVisible(page.heroSavingsAmount);
    });

    test('shows "We found" label', async () => {
      await page.expectVisible(page.weFoundLabel);
    });

    test('shows summary cards', async () => {
      await page.expectVisible(page.subscriptionsFoundCard);
      await page.expectVisible(page.wasteDetectedCard);
      await page.expectVisible(page.negotiationsPossibleCard);
    });

    test('shows Review & Save CTA button', async () => {
      await page.expectVisible(page.reviewAndSaveButton);
    });
  });

  test.describe('Action Approval Screen', () => {
    let page: ActionApprovalPage;

    test.beforeEach(async ({ page: p }) => {
      page = new ActionApprovalPage(p);
      await page.navigate();
    });

    test('displays heading', async () => {
      await page.expectVisible(page.heading);
    });

    test('shows Approve All button', async () => {
      await page.expectVisible(page.approveAllButton);
    });

    test('shows cancel section with actions', async () => {
      await page.expectVisible(page.cancelSection);
    });

    test('shows negotiate section with actions', async () => {
      await page.expectVisible(page.negotiateSection);
    });

    test('each action has a toggle switch', async () => {
      const toggle = page.getActionToggle('Adobe Creative Cloud');
      await page.expectVisible(toggle);
    });

    test('each action shows estimated savings', async () => {
      const savings = page.getActionSavings('Adobe Creative Cloud');
      await page.expectVisible(savings);
    });
  });
});
