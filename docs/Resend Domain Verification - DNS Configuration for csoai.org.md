# Resend Domain Verification - DNS Configuration for csoai.org

The domain **csoai.org** has been successfully added to your Resend account. To complete verification and enable email deliverability, you need to add the following DNS records to your domain's DNS settings.

## Domain Information

| Field | Value |
|-------|-------|
| **Domain ID** | `ea22e746-8ed4-495d-8c54-8d91dafc53a2` |
| **Domain Name** | `csoai.org` |
| **Region** | `us-east-1` |
| **Status** | `not_started` (pending DNS verification) |

---

## Required DNS Records

You need to add **3 DNS records** to your domain's DNS configuration:

### 1. DKIM Record (TXT)

This record is used for email authentication via DKIM (DomainKeys Identified Mail).

| Field | Value |
|-------|-------|
| **Type** | `TXT` |
| **Name/Host** | `resend._domainkey` |
| **Value** | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaXJcPxp0qk6QCHghvKhxLPw1Uxk1GRqaZ47DJ0eVB/CXYLB1+oI5d/XPrk2HaPVzwrPBbDaJ96C/xxJNnRzUE+QnMsd21zgFEDgCVcqJY7JLyojP9JRHWDZ7fSlcc6BkGxnqgr9ltWIKh04akCq43Tlqs1wH1oMIp5F2T69cYGQIDAQAB` |
| **TTL** | `Auto` or `3600` |

### 2. SPF Record - MX (Mail Exchange)

This MX record is required for SPF authentication and bounce handling.

| Field | Value |
|-------|-------|
| **Type** | `MX` |
| **Name/Host** | `send` |
| **Value** | `feedback-smtp.us-east-1.amazonses.com` |
| **Priority** | `10` |
| **TTL** | `Auto` or `3600` |

### 3. SPF Record - TXT

This TXT record specifies which mail servers are authorized to send email on behalf of your domain.

| Field | Value |
|-------|-------|
| **Type** | `TXT` |
| **Name/Host** | `send` |
| **Value** | `v=spf1 include:amazonses.com ~all` |
| **TTL** | `Auto` or `3600` |

---

## DNS Provider Instructions

### For Cloudflare:
1. Log in to your Cloudflare dashboard
2. Select the `csoai.org` domain
3. Go to **DNS** → **Records**
4. Click **Add record** for each of the 3 records above
5. For the TXT records, make sure to enter the value exactly as shown (no quotes needed in Cloudflare)

### For GoDaddy:
1. Log in to your GoDaddy account
2. Go to **My Products** → **DNS**
3. Select `csoai.org`
4. Add each record using the **Add** button

### For Namecheap:
1. Log in to Namecheap
2. Go to **Domain List** → **Manage** for `csoai.org`
3. Click **Advanced DNS**
4. Add each record using **Add New Record**

### For Google Domains / Squarespace:
1. Log in to your Google Domains / Squarespace account
2. Select `csoai.org`
3. Go to **DNS** settings
4. Add custom records for each entry

---

## Important Notes

1. **DNS Propagation**: After adding the records, it may take up to 24-48 hours for DNS changes to propagate globally, though most changes take effect within 1-2 hours.

2. **Subdomain Records**: The `send` subdomain records (MX and TXT) will create `send.csoai.org` - this is intentional and used for SPF authentication.

3. **DKIM Record**: The `resend._domainkey` creates `resend._domainkey.csoai.org` - this is the standard DKIM selector format.

4. **Verification**: Once DNS records are configured, return to Resend or run the verification script to confirm the domain status.

---

## After DNS Configuration

Once you've added all DNS records, you can verify the domain by:

1. **Via Resend Dashboard**: Go to [Resend Domains](https://resend.com/domains) and click "Verify" on the csoai.org domain

2. **Via API**: The verification will be triggered automatically, or you can manually verify using the domain ID:
   - Domain ID: `ea22e746-8ed4-495d-8c54-8d91dafc53a2`

---

## Summary Table

| Record Type | Name/Host | Value | Priority |
|-------------|-----------|-------|----------|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaXJcPxp0qk6QCHghvKhxLPw1Uxk1GRqaZ47DJ0eVB/CXYLB1+oI5d/XPrk2HaPVzwrPBbDaJ96C/xxJNnRzUE+QnMsd21zgFEDgCVcqJY7JLyojP9JRHWDZ7fSlcc6BkGxnqgr9ltWIKh04akCq43Tlqs1wH1oMIp5F2T69cYGQIDAQAB` | - |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | - |
