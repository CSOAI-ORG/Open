
describe('Sentry Integration', () => {
  it('should have SENTRY_DSN environment variable configured', () => {
    const sentryDsn = process.env.SENTRY_DSN;
    
    // Verify DSN is set
    expect(sentryDsn).toBeDefined();
    expect(sentryDsn).not.toBe('');
    
    // Verify DSN format (should be a valid Sentry DSN URL)
    expect(sentryDsn).toMatch(/^https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.[a-z]+\.sentry\.io\/\d+$/);
  });

  it('should have VITE_SENTRY_DSN environment variable configured', () => {
    const viteSentryDsn = process.env.VITE_SENTRY_DSN;
    
    // Verify DSN is set
    expect(viteSentryDsn).toBeDefined();
    expect(viteSentryDsn).not.toBe('');
    
    // Verify DSN format
    expect(viteSentryDsn).toMatch(/^https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.[a-z]+\.sentry\.io\/\d+$/);
  });

  it('should be able to parse Sentry DSN components', () => {
    const sentryDsn = process.env.SENTRY_DSN;
    if (!sentryDsn) {
      throw new Error('SENTRY_DSN not configured');
    }
    
    // Parse DSN URL
    const url = new URL(sentryDsn);
    
    // Verify it's using HTTPS
    expect(url.protocol).toBe('https:');
    
    // Verify it has a public key (username in URL)
    expect(url.username).toBeTruthy();
    expect(url.username.length).toBeGreaterThan(10);
    
    // Verify it points to Sentry's ingest endpoint
    expect(url.hostname).toContain('sentry.io');
    
    // Verify it has a project ID (path)
    expect(url.pathname).toMatch(/^\/\d+$/);
  });

  it('should validate Sentry DSN by making a test request', async () => {
    const sentryDsn = process.env.SENTRY_DSN;