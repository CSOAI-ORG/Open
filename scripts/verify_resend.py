import requests
import os
import json

api_key = os.environ.get('RESEND_API_KEY')
if not api_key:
    print("Error: RESEND_API_KEY not found in environment")
    exit(1)

# Domain ID from earlier
domain_id = "ea22e746-8ed4-495d-8c54-8d91dafc53a2"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# First, verify the domain
print("Triggering domain verification...")
verify_response = requests.post(
    f"https://api.resend.com/domains/{domain_id}/verify",
    headers=headers
)
print("Verify Response:", verify_response.status_code)
if verify_response.text:
    print(json.dumps(verify_response.json(), indent=2))

# Then get the domain details
print("\nGetting domain details...")
response = requests.get(
    f"https://api.resend.com/domains/{domain_id}",
    headers=headers
)
print("Domain Details:")
print(json.dumps(response.json(), indent=2))
