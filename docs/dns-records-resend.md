# DNS Records for coai.manus.space Email Verification (Resend)

## Domain Verification - DKIM Record
| Type | Name | Content | TTL |
|------|------|---------|-----|
| TXT | resend._domainkey.coai | p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC328E0E+/mXuXWgYqbq+DN0qs7PbOZ7z89A7SCzGWg6aed+Yuq2kLO28xvHy6IdUXgAMYL1GLGUy9IFxjy0BWi4Leaob1CICtUM8Ua7eSVBMp7YMFA9WkWhuxmyGX+xZZskzA5E6ZCwVsuj2mlsRJwlbrVuSIEWTZxDLRTHfZuaQIDAQAB | Auto |

## Enable Sending - SPF Records
| Type | Name | Content | TTL | Priority |
|------|------|---------|-----|----------|
| MX | send.coai | feedback-smtp.eu-west-1.amazonses.com | Auto | 10 |
| TXT | send.coai | v=spf1 include:amazonses.com ~all | Auto | - |

## DMARC (Optional)
| Type | Name | Content | TTL |
|------|------|---------|-----|
| TXT | _dmarc | v=DMARC1; p=none; | Auto |

## Enable Receiving - MX Record
| Type | Name | Content | TTL | Priority |
|------|------|---------|-----|----------|
| MX | coai | inbound-smtp.eu-west-1.amazonaws.com | Auto | 10 |

---

## Important Notes

1. **Domain**: coai.manus.space (subdomain of manus.space)
2. **Region**: Ireland (eu-west-1)
3. **Status**: Pending DNS verification

Since coai.manus.space is a Manus-managed domain, the DNS records need to be configured through Manus's domain management system or Cloudflare (if that's where the DNS is managed).

## Action Required

The user needs to add these DNS records to the manus.space domain's DNS configuration to enable email sending from coai.manus.space.
