#!/usr/bin/env python3
"""
Resend Domain Setup Script
This script manages domain verification for Resend email service.
"""

import os
import requests
import json

# Get API key from environment
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
BASE_URL = "https://api.resend.com"

def list_domains():
    """List all domains in the Resend account"""
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/domains", headers=headers)
    return response.json()

def create_domain(domain_name, region="us-east-1"):
    """Create a new domain in Resend"""
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "name": domain_name,
        "region": region
    }
    
    response = requests.post(f"{BASE_URL}/domains", headers=headers, json=data)
    return response.json()

def verify_domain(domain_id):
    """Verify a domain in Resend"""
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/domains/{domain_id}/verify", headers=headers)
    return response.json()

def get_domain(domain_id):
    """Get domain details including DNS records"""
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/domains/{domain_id}", headers=headers)
    return response.json()

if __name__ == "__main__":
    if not RESEND_API_KEY:
        print("ERROR: RESEND_API_KEY environment variable not set")
        exit(1)
    
    print("=" * 60)
    print("Resend Domain Management")
    print("=" * 60)
    
    # First, list existing domains
    print("\n1. Listing existing domains...")
    domains = list_domains()
    print(json.dumps(domains, indent=2))
    
    # Check if csoai.org already exists
    domain_name = "csoai.org"
    existing_domain = None
    
    if "data" in domains:
        for domain in domains["data"]:
            if domain.get("name") == domain_name:
                existing_domain = domain
                break
    
    if existing_domain:
        print(f"\n2. Domain '{domain_name}' already exists!")
        print(f"   Domain ID: {existing_domain.get('id')}")
        print(f"   Status: {existing_domain.get('status')}")
        
        # Get full domain details with DNS records
        print("\n3. Getting domain details with DNS records...")
        domain_details = get_domain(existing_domain.get('id'))
        print(json.dumps(domain_details, indent=2))
        
        # Try to verify if not verified
        if existing_domain.get('status') != 'verified':
            print("\n4. Attempting to verify domain...")
            verify_result = verify_domain(existing_domain.get('id'))
            print(json.dumps(verify_result, indent=2))
    else:
        print(f"\n2. Creating domain '{domain_name}'...")
        create_result = create_domain(domain_name)
        print(json.dumps(create_result, indent=2))
        
        if "id" in create_result:
            print("\n3. Domain created successfully!")
            print("   DNS records to configure are shown above.")
