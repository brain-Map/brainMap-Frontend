/**
 * PayHere Configuration Utility
 * Handles sandbox/live mode switching and environment-based configuration
 */

export type PayHereMode = 'sandbox' | 'live';

export interface PayHereConfig {
  mode: PayHereMode;
  apiUrl: string;
  merchantId: string;
  isSandbox: boolean;
}

class PayHereConfigService {
  private config: PayHereConfig;

  constructor() {
    this.config = this.initializeConfig();
  }

  private initializeConfig(): PayHereConfig {
    // Get mode from environment variable (default to sandbox for safety)
    const mode = (process.env.NEXT_PUBLIC_PAYHERE_MODE || 'sandbox') as PayHereMode;
    
    // Validate mode
    if (mode !== 'sandbox' && mode !== 'live') {
      console.warn('Invalid PayHere mode. Defaulting to sandbox.');
      return this.getSandboxConfig();
    }

    return mode === 'sandbox' ? this.getSandboxConfig() : this.getLiveConfig();
  }

  private getSandboxConfig(): PayHereConfig {
    return {
      mode: 'sandbox',
      apiUrl: 'https://sandbox.payhere.lk/pay/checkout', // Backend will use this
      merchantId: 'backend-managed', // Backend handles merchant ID
      isSandbox: true
    };
  }

  private getLiveConfig(): PayHereConfig {
    return {
      mode: 'live',
      apiUrl: 'https://www.payhere.lk/pay/checkout', // Backend will use this
      merchantId: 'backend-managed', // Backend handles merchant ID
      isSandbox: false
    };
  }

  /**
   * Get current PayHere configuration
   */
  public getConfig(): PayHereConfig {
    return { ...this.config };
  }

  /**
   * Get PayHere API URL based on current mode
   */
  public getApiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get merchant ID based on current mode
   */
  public getMerchantId(): string {
    return this.config.merchantId;
  }

  /**
   * Check if currently in sandbox mode
   */
  public isSandboxMode(): boolean {
    return this.config.isSandbox;
  }

  /**
   * Get mode string for display purposes
   */
  public getModeDisplay(): string {
    return this.config.mode.toUpperCase();
  }

  /**
   * Get test card information for sandbox mode
   */
  public getTestCards() {
    if (!this.isSandboxMode()) {
      return null;
    }

    return {
      visa: {
        number: '4916217501611292',
        expiry: '12/25',
        cvv: '123',
        name: 'Test User'
      },
      mastercard: {
        number: '5413042007434731',
        expiry: '12/25',
        cvv: '123',
        name: 'Test User'
      },
      american_express: {
        number: '377451000000018',
        expiry: '12/25',
        cvv: '1234',
        name: 'Test User'
      }
    };
  }

  /**
   * Validate configuration
   */
  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.apiUrl) {
      errors.push('PayHere API URL is not configured');
    }

    if (!this.config.mode) {
      errors.push('PayHere mode is not configured');
    }

    // URL validation
    try {
      new URL(this.config.apiUrl);
    } catch {
      errors.push('PayHere API URL is not a valid URL');
    }

    // Note: Merchant ID validation is handled by backend
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const payHereConfig = new PayHereConfigService();

// Export types and classes for external use
export default PayHereConfigService;
