# PicForge Testing Quick Reference

**Version:** 1.0 | **Date:** October 23, 2025

---

## Run All Tests (Automated)

### Windows:
```bash
scripts\run-all-tests.bat
```

### Mac/Linux:
```bash
bash scripts/run-all-tests.sh
```

**Time:** 15-20 minutes | **Result:** Pass/Fail report

---

## Individual Test Commands

```bash
# 1. Environment validation (2 min)
npm run check-env

# 2. Security audit (3 min)
npm run security-audit

# 3. Rate limiting tests (5-10 min)
npm run test:rate-limiting

# 4. Email delivery tests (2-3 min)
npm run test:emails

# 5. Performance tests (5-10 min)
npm run test:performance

# 6. Cost monitoring (1 min)
npm run monitor:costs
```

---

## Manual Test Checklists

| Test | File | Duration |
|------|------|----------|
| **Payment Flow** | `scripts/test-payment-flow.md` | 30-45 min |
| **Analytics** | `scripts/test-analytics.md` | 45-60 min |
| **User Journey** | `scripts/test-full-user-journey.md` | 60-90 min |
| **Cross-Browser** | `docs/BROWSER_TESTING.md` | 2-3 hours |

---

## Master Documents

| Document | Purpose |
|----------|---------|
| `docs/LAUNCH_CHECKLIST.md` | Complete launch readiness checklist |
| `docs/MONITORING.md` | Post-launch monitoring procedures |
| `docs/TESTING_FRAMEWORK_README.md` | Complete testing guide |
| `docs/LAUNCH_SIGN_OFF_TEMPLATE.md` | Final sign-off report |
| `TESTING_FRAMEWORK_SUMMARY.md` | Framework overview |

---

## Critical Pass Criteria

### Must Pass ALL Before Launch:

1. ✅ **Security Audit** → Zero critical vulnerabilities
2. ✅ **Rate Limiting** → 6/6 tests pass
3. ✅ **Payment Flow** → 24/24 tests pass
4. ✅ **Email Delivery** → 4/4 emails delivered
5. ✅ **Analytics** → 21/21 events tracked
6. ✅ **Performance** → Lighthouse 90+ (all categories)
7. ✅ **User Journey** → 12/12 steps complete
8. ✅ **Cross-Browser** → All major browsers work
9. ✅ **Legal Docs** → Privacy Policy + ToS published

---

## Common Issues

### Rate Limiting Fails
→ Check Vercel KV connection
→ Verify KV environment variables

### Email Tests Fail
→ Verify Resend API key
→ Check domain verification

### Payment Tests Fail
→ Check Stripe webhook configured
→ Verify webhook signature secret

### Analytics Not Tracking
→ Verify GA4 Measurement ID
→ Check cookie consent accepted

---

## Environment Variables Required

```bash
# Core (Required)
GEMINI_API_KEY=
REPLICATE_API_TOKEN=
NEXT_PUBLIC_INSTANT_APP_ID=

# Testing (Required)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

---

## Test Reports Generated

- `security-audit-report.json` - Security findings
- `performance-report.json` - Performance metrics
- `cost-report.json` - Daily cost breakdown
- `cost-history.csv` - 30-day cost history
- `test-results/test-report-*.txt` - Full test run results

---

## Daily Monitoring (Post-Launch)

```bash
# Run every morning at 9 AM
npm run monitor:costs

# Check dashboards:
# - Vercel: vercel.com/dashboard
# - GA4: analytics.google.com
# - Stripe: dashboard.stripe.com
# - Resend: resend.com/emails
```

---

## Emergency Contacts

- **Derek Bobola:** derek.bobola@gmail.com
- **Vercel Support:** vercel.com/support
- **Stripe Support:** support@stripe.com

---

## Status Pages

- Vercel: vercel-status.com
- Stripe: status.stripe.com
- Resend: status.resend.com
- InstantDB: status.instantdb.com

---

## Rollback Procedure

```bash
# If critical bug after launch:
git revert HEAD
git push origin main --force

# Clear Vercel cache
# Monitor for 15 minutes
# Notify users
```

---

## Go/No-Go Decision

**GO if:**
- All 9 critical tests pass
- No blocking security issues
- Cost projections acceptable
- Team confident

**NO-GO if:**
- Any critical test fails
- Security vulnerabilities found
- Payment processing broken
- Legal docs incomplete

---

## Next Steps After All Tests Pass

1. ✅ Complete `LAUNCH_SIGN_OFF_TEMPLATE.md`
2. ✅ Final team review meeting
3. ✅ Deploy to production
4. ✅ Monitor first 48 hours closely
5. ✅ Follow `MONITORING.md` schedule

---

## Quick Wins

**If short on time, prioritize these:**

1. `npm run security-audit` (3 min) - Must pass
2. `npm run test:rate-limiting` (10 min) - Must pass
3. `scripts/test-payment-flow.md` (45 min) - Must pass
4. `scripts/test-full-user-journey.md` (90 min) - Must pass

**Total:** 2.5 hours for critical path

---

## Testing Timeline

### Minimum (2-3 days):
- Day 1: All automated tests + payment flow
- Day 2: Analytics + user journey tests
- Day 3: Browser testing + final review

### Recommended (5-7 days):
- Day 1: Automated tests
- Day 2: Payment flow + analytics
- Day 3: User journey + performance
- Day 4: Cross-browser testing
- Day 5: Fix issues, re-test
- Day 6: Final review + sign-off
- Day 7: Launch + monitor

---

## Support

**Questions?**
→ Read `docs/TESTING_FRAMEWORK_README.md`
→ Check `TESTING_FRAMEWORK_SUMMARY.md`
→ Review individual test file comments

**Issues?**
→ Document in `LAUNCH_SIGN_OFF_TEMPLATE.md`
→ Fix before launch
→ Re-run tests

---

## Success Metrics (First 48 Hours)

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| New Signups | 50+ |
| Pro Conversions | 2+ |
| Error Rate | <1% |
| Response Time | <500ms |

---

**Ready to launch? Run `scripts\run-all-tests.bat` and let's go! 🚀**

---

**Last Updated:** October 23, 2025
**Framework Version:** 1.0
