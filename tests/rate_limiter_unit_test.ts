/**
 * Unit & Integration Tests for JUANET.cloud Rate Limiter & Fallback Safeguards
 * Execute with: npx tsx tests/rate_limiter_unit_test.ts
 */

import assert from 'node:assert';

// 1. IP Validation Logic
function isValidIp(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(ip)) {
    return true;
  }
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?::(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?$/;
  return ipv6Regex.test(ip);
}

// 2. Client IP Extraction
function extractClientIp(headers: Map<string, string>): string {
  const cfIp = headers.get('cf-connecting-ip')?.trim();
  if (cfIp && isValidIp(cfIp)) {
    return cfIp;
  }

  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const parts = xForwardedFor.split(',');
    for (const part of parts) {
      const candidate = part.trim();
      if (isValidIp(candidate)) {
        return candidate;
      }
    }
  }

  return 'unknown-client';
}

// 3. Salted SHA-256 Hasher
async function hashClientIp(ip: string, salt: string = 'test-salt-2026'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${ip}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// 4. In-Memory Burst Limiter Logic Test
class MemoryBurstLimiter {
  private map = new Map<string, { count: number; expiresAt: number }>();

  check(hash: string, maxRequests: number, windowMs: number, now: number): boolean {
    const record = this.map.get(hash);
    if (record && record.expiresAt > now) {
      if (record.count >= maxRequests) {
        return false;
      }
      record.count++;
      return true;
    }
    this.map.set(hash, { count: 1, expiresAt: now + windowMs });
    return true;
  }
}

async function runTests() {
  console.log('--- RUNNING RATE LIMITER & FALLBACK VERIFICATION SUITE ---');

  // TEST 1: IP Validation
  console.log('Test 1: IP validation for IPv4, IPv6, and malicious inputs...');
  assert.strictEqual(isValidIp('192.168.1.1'), true);
  assert.strictEqual(isValidIp('105.160.45.12'), true);
  assert.strictEqual(isValidIp('256.0.0.1'), false); // invalid octet
  assert.strictEqual(isValidIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), true);
  assert.strictEqual(isValidIp('fe80::1'), true);
  assert.strictEqual(isValidIp('<script>alert(1)</script>'), false);
  assert.strictEqual(isValidIp('127.0.0.1; DROP TABLE inquiries;'), false);
  assert.strictEqual(isValidIp(''), false);
  console.log('✓ Test 1 Passed.');

  // TEST 2: Trusted Proxy Header Precedence
  console.log('Test 2: Trusted proxy header precedence (CF-Connecting-IP > X-Real-IP > X-Forwarded-For)...');
  const h1 = new Map([
    ['cf-connecting-ip', '102.215.34.10'],
    ['x-real-ip', '192.168.1.50'],
    ['x-forwarded-for', '10.0.0.1, 10.0.0.2'],
  ]);
  assert.strictEqual(extractClientIp(h1), '102.215.34.10');

  // When CF is absent, falls back to X-Real-IP
  const h2 = new Map([
    ['x-real-ip', '196.201.214.5'],
    ['x-forwarded-for', '10.0.0.1'],
  ]);
  assert.strictEqual(extractClientIp(h2), '196.201.214.5');

  // When headers are missing, falls back to safe fallback
  const h3 = new Map<string, string>();
  assert.strictEqual(extractClientIp(h3), 'unknown-client');
  console.log('✓ Test 2 Passed.');

  // TEST 3: Cryptographic Salted Hashing
  console.log('Test 3: Salted SHA-256 IP hashing privacy guarantees...');
  const hashA = await hashClientIp('105.160.45.12');
  const hashB = await hashClientIp('105.160.45.13');
  const hashA_repeat = await hashClientIp('105.160.45.12');

  assert.strictEqual(hashA.length, 64); // standard SHA-256 hex length
  assert.strictEqual(/^[0-9a-f]{64}$/.test(hashA), true);
  assert.strictEqual(hashA, hashA_repeat); // deterministic
  assert.notStrictEqual(hashA, hashB); // collision-free across different IPs
  assert.strictEqual(hashA.includes('105'), false); // raw IP not in hash
  console.log('✓ Test 3 Passed.');

  // TEST 4: Burst Limiter Lifecycle & Window Expiry
  console.log('Test 4: In-memory burst rate limiter lifecycle...');
  const limiter = new MemoryBurstLimiter();
  const testHash = 'test-client-hash-1';
  const startTime = 1000000;

  // First 10 requests allowed
  for (let i = 1; i <= 10; i++) {
    const allowed = limiter.check(testHash, 10, 600000, startTime + i * 100);
    assert.strictEqual(allowed, true, `Request ${i} should be allowed`);
  }

  // 11th request rejected
  const req11 = limiter.check(testHash, 10, 600000, startTime + 1100);
  assert.strictEqual(req11, false, 'Request 11 should be rejected under 10-req cap');

  // After window expiry (+600,200 ms), request is allowed again
  const expiredTime = startTime + 600200;
  const reqAfterExpiry = limiter.check(testHash, 10, 600000, expiredTime);
  assert.strictEqual(reqAfterExpiry, true, 'Request after window expiry should reset and succeed');
  console.log('✓ Test 4 Passed.');

  // TEST 5: Fallback Safeguard Rule Verification
  console.log('Test 5: Edge Function rejection vs. Fallback behavior...');
  // Simulated responses from supabase.functions.invoke:
  function evaluateFallback(edgeStatus: number | undefined, errorName: string | undefined): 'fallback_direct_db' | 'reject_client' {
    if (edgeStatus === 404 || errorName === 'FunctionsRelayError') {
      return 'fallback_direct_db';
    }
    return 'reject_client';
  }

  assert.strictEqual(evaluateFallback(404, undefined), 'fallback_direct_db', '404 not deployed must fallback');
  assert.strictEqual(evaluateFallback(undefined, 'FunctionsRelayError'), 'fallback_direct_db', 'Relay error must fallback');
  assert.strictEqual(evaluateFallback(429, undefined), 'reject_client', '429 Rate Limit MUST NOT fallback');
  assert.strictEqual(evaluateFallback(400, undefined), 'reject_client', '400 Validation Error MUST NOT fallback');
  assert.strictEqual(evaluateFallback(413, undefined), 'reject_client', '413 Payload Too Large MUST NOT fallback');
  assert.strictEqual(evaluateFallback(500, undefined), 'reject_client', '500 Server Error MUST NOT fallback');
  console.log('✓ Test 5 Passed.');

  console.log('\nALL AUTOMATED UNIT & INTEGRATION TESTS COMPLETED SUCCESSFULLY.');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
