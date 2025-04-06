import requests
import json
import os
from datetime import datetime
from dateutil.relativedelta import relativedelta
from dotenv import load_dotenv


load_dotenv()

auth_key = os.getenv('NETFLEX_AUTH_USERNAME_PASSWORD')
if not auth_key:
    raise ValueError("NETFLEX_AUTH_USERNAME_PASSWORD environment variable not set")


def download_and_append_data_monthly(base_url, output_file="output.json", start_year=1990, start_month=1):
    """
    Downloads data from the given URL month by month, using the 'created' field filter,
    and appends the new data to an existing JSON file.
    """
    headers = {
        "Authorization": f'Basic {auth_key}'
    }

    current_date = datetime(start_year, start_month, 1)
    now = datetime.now()

    if os.path.exists(output_file):
        try:
            with open(output_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
            all_data = existing_data.get("data", [])
        except (FileNotFoundError, json.JSONDecodeError):
            all_data = []
    else:
        all_data = []

    while current_date <= now:
        next_month = current_date + relativedelta(months=1) - relativedelta(days=1)
        start_date_str = current_date.strftime("%Y-%m-%d")
        end_date_str = next_month.strftime("%Y-%m-%d")

        q_value = f"created:>={start_date_str} created:<={end_date_str}"
        url = f"{base_url}&q={q_value}"

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json().get("data", [])
            all_data.extend(data)
            print(f"Downloaded data for {start_date_str} to {end_date_str}: {len(data)} items")

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data for {start_date_str} to {end_date_str}: {e}")

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON for {start_date_str} to {end_date_str}: {e}")

        current_date = current_date + relativedelta(months=1)

    if all_data:
        try:
            final_output = {
                "total": len(all_data),
                "per_page": 1000, # or the API's per_page value
                "current_page": 1,
                "last_page": 1, # or number of pages. If pagination is needed, then calculate it.
                "from": 1,
                "to": len(all_data),
                "data": all_data
            }
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(final_output, f, ensure_ascii=False, indent=4)
            print(f"Data saved to {output_file}")
        except Exception as e:
            print(f"Error saving data to {output_file}: {e}")
    else:
        print("No data was downloaded.")

if __name__ == "__main__":
    relation = 'signup'
    base_url = f"https://api.bergenchamber.netflexapp.com/v1/search?relation={relation}&order=created&dir=desc&size=1000&fields=*"
    download_and_append_data_monthly(base_url, f'{relation}.json', 2024)
