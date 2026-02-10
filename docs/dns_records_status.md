# DNS Records Status for csoai.org - Resend Email Verification

## Current Status
- **Domain ID**: ea22e746-8ed4-495d-8c54-8d91dafc53a2
- **Domain**: csoai.org
- **Region**: us-east-1
- **Status**: not_started (pending DNS verification)

## Required DNS Records for Resend

### 1. DKIM TXT Record ✅ ADDED
- **Type**: TXT Record
- **Host**: resend._domainkey
- **Value**: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaXJcPxp0qk6QCHghvKhxLPw1Uxk1GRqaZ47DJ0eVB/CXYLB1+oI5d/XPrk2HaPVzwrPBbDaJ96C/xxJNnRzUE+QnMsd21zgFEDgCVcqJY7JLyojP9JRHWDZ7fSlcc6BkGxnqgr9ltWIKh04akCq43Tlqs1wH1oMIp5F2T69cYGQIDAQAB

### 2. SPF MX Record ⏳ PENDING
- **Type**: MX Record
- **Host**: send
- **Value**: feedback-smtp.us-east-1.amazonses.com
- **Priority**: 10

### 3. SPF TXT Record ⏳ PENDING
- **Type**: TXT Record
- **Host**: send
- **Value**: v=spf1 include:amazonses.com ~all

## Existing DNS Records in Namecheap
- A Record: @ → 104.18.26.246
- A Record: @ → 104.18.27.246
- CNAME Record: @ → cname.manus.space.
- TXT Record: @ → v=spf1 include:spf.privateemail.com ~all
- TXT Record: _dmarc → v=DMARC1; p=none; rua=mailto:outreach@csoai.org
- TXT Record: default._domainkey → v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuAoLPZW/G9OPtemYq7yoEzKEACzP2af5Qdm6Hon9drG8hVmNjZsdG01nCFfkFR9G8kk+/Ohd8l3cVk5OX2q6PA8Pm2eR3Em5L6dPybC+JErIN7HE0NUDMgWNgzGvAVH+wpPLfpEZz1FgnqYc5CGWYXQSKSuW+JLrS9SU7Hfyy5UjTpY8L2gSy+yRwBVUHa18kC0ctwjc0merzKjrJpqn4K9YHgMmim0+Rspt1P7SnikAadKKF6PT10a2cqvwM20CbUYMTGwSbqrcFDpx3J+QoEGQiXZ7IW6oJ66JtU8hN2Oip+tpU383LMRnSL3dAAiw4/YVyDatE0UuIb28pWkxNwIDAQAB
- TXT Record: resend._domainkey → p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaXJcPxp0qk6QCHghvKhxLPw1Uxk1GRqaZ47DJ0eVB/CXYLB1+oI5d/XPrk2HaPVzwrPBbDaJ96C/xxJNnRzUE+QnMsd21zgFEDgCVcqJY7JLyojP9JRHWDZ7fSlcc6BkGxnqgr9ltWIKh04akCq43Tlqs1wH1oMIp5F2T69cYGQIDAQAB

## Notes
- The Namecheap interface dropdown is difficult to interact with programmatically
- Need to add MX and TXT records for the "send" subdomain
- The MAIL SETTINGS section shows "Private Email" is configured, which may need to be changed to "Custom MX" to add the MX record for the send subdomain
