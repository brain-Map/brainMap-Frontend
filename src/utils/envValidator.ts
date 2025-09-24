/**
 * Environment Variable Validation Utility
 * Validates required environment variables for PayHere integration
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class EnvValidator {
  /**
   * Validate all required environment variables for PayHere integration
   */
  static validatePayHereEnv(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check PayHere mode
    const mode = process.env.NEXT_PUBLIC_PAYHERE_MODE;
    if (!mode) {
      errors.push('NEXT_PUBLIC_PAYHERE_MODE is required (should be "sandbox" or "live")');
    } else if (mode !== 'sandbox' && mode !== 'live') {
      errors.push('NEXT_PUBLIC_PAYHERE_MODE must be either "sandbox" or "live"');
    }

    // Check base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      errors.push('NEXT_PUBLIC_BASE_URL is required for callback URLs');
    } else {
      try {
        new URL(baseUrl);
      } catch {
        errors.push('NEXT_PUBLIC_BASE_URL must be a valid URL');
      }
    }

    // Check backend configuration
    const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!backendPort && !apiUrl) {
      errors.push('Either NEXT_PUBLIC_BACKEND_PORT or NEXT_PUBLIC_API_URL is required');
    }

    // Mode-specific validation
    if (mode === 'sandbox') {
      const sandboxUrl = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX_URL;
      const sandboxMerchantId = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX_MERCHANT_ID;
      
      if (!sandboxUrl) {
        warnings.push('NEXT_PUBLIC_PAYHERE_SANDBOX_URL not set, using default');
      }
      
      if (!sandboxMerchantId) {
        warnings.push('NEXT_PUBLIC_PAYHERE_SANDBOX_MERCHANT_ID not set, using PayHere test merchant ID');
      }
    } else if (mode === 'live') {
      const liveUrl = process.env.NEXT_PUBLIC_PAYHERE_LIVE_URL;
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
      
      if (!liveUrl) {
        warnings.push('NEXT_PUBLIC_PAYHERE_LIVE_URL not set, using default');
      }
      
      if (!merchantId) {
        errors.push('NEXT_PUBLIC_PAYHERE_MERCHANT_ID is required for live mode');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Log validation results to console
   */
  static logValidationResults(): void {
    const result = this.validatePayHereEnv();
    
    if (result.isValid) {
      console.log('✅ PayHere environment validation passed');
      
      if (result.warnings.length > 0) {
        console.warn('⚠️ PayHere environment warnings:');
        result.warnings.forEach(warning => console.warn(`  - ${warning}`));
      }
    } else {
      console.error('❌ PayHere environment validation failed:');
      result.errors.forEach(error => console.error(`  - ${error}`));
      
      if (result.warnings.length > 0) {
        console.warn('⚠️ Additional warnings:');
        result.warnings.forEach(warning => console.warn(`  - ${warning}`));
      }
    }
  }

  /**
   * Get current environment configuration summary
   */
  static getConfigSummary(): Record<string, any> {
    return {
      payHereMode: process.env.NEXT_PUBLIC_PAYHERE_MODE || 'not-set',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'not-set',
      backendPort: process.env.NEXT_PUBLIC_BACKEND_PORT || 'not-set',
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'not-set',
      sandboxUrl: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX_URL || 'using-default',
      liveUrl: process.env.NEXT_PUBLIC_PAYHERE_LIVE_URL || 'using-default',
      sandboxMerchantId: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX_MERCHANT_ID || 'using-default',
      liveMerchantId: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || 'not-set'
    };
  }
}

// Auto-validate on import in development
if (process.env.NODE_ENV === 'development') {
  EnvValidator.logValidationResults();
}
