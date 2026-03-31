import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WelcomePage extends BasePage {
  readonly url = '/signup';

  constructor(page: Page) {
    super(page);
  }

  get logo(): Locator {
    return this.page.getByTestId('app-logo');
  }

  get tagline(): Locator {
    return this.page.getByText('Stop overpaying. Start saving.');
  }

  get subtitle(): Locator {
    return this.page.getByText('Your AI agent that finds, cancels, and negotiates');
  }

  get emailSignupButton(): Locator {
    return this.page.getByRole('button', { name: /sign up with email/i });
  }

  get googleButton(): Locator {
    return this.page.getByRole('button', { name: /continue with google/i });
  }

  get appleButton(): Locator {
    return this.page.getByRole('button', { name: /continue with apple/i });
  }

  get loginLink(): Locator {
    return this.page.getByRole('link', { name: /log in/i });
  }

  async signUpWithEmail(): Promise<void> {
    await this.emailSignupButton.click();
  }

  async goToLogin(): Promise<void> {
    await this.loginLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}
