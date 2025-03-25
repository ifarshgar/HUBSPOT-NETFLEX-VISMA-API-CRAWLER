import requests
import json
import os
from dotenv import load_dotenv


load_dotenv()

api_key = os.getenv('VISMA_AUTH_API_KEY')
if not api_key:
    raise ValueError("VISMA_AUTH_API_KEY environment variable not set")

company_no = os.getenv('COMPANY_NO')
if not company_no:
    raise ValueError('COMPANY_NO environment variable not set')


# Base URL
base_url = "https://medlem.bergen-chamber.no/api/Customer"

# Headers for the request
headers = {
    "apikey": api_key,
    "CompanyNo": company_no
}

# Initialize variables
offset = 0
all_items = []

# Loop to fetch all records
while True:
    # Construct the URL with the current offset
    url = f"{base_url}?Offset={offset}"
    
    # Make the request with headers
    response = requests.get(url, headers=headers)
    
    # Check if the request was successful
    if response.status_code != 200:
        print(f"Failed to fetch data: {response.status_code}")
        print(f"Response: {response.text}")
        break
    
    # Parse the JSON response
    data = response.json()
    
    # Append the items to the all_items list
    all_items.extend(data["Item"])
    
    # Update the offset
    offset += 1000
    
    # Check if we have fetched all records
    if offset >= data["Meta"]["Total"]:
        break

# Create the final structure
final_data = {
    "Meta": {
        "Count": len(all_items),
        "Total": len(all_items),
        "Offset": 0
    },
    "Item": all_items
}

# Save the final data to a file
with open("all_records.json", "w", encoding="utf-8") as f:
    json.dump(final_data, f, ensure_ascii=False, indent=4)

print(f"All records fetched and saved to 'all_records.json'. Total records: {len(all_items)}")