import requests
import json
import os
from dotenv import load_dotenv


load_dotenv()

auth_key = os.getenv('NETFLEX_AUTH_USERNAME_PASSWORD')
if not auth_key:
    raise ValueError("NETFLEX_AUTH_USERNAME_PASSWORD environment variable not set")



def download_and_append_data(url, output_file="output.json", start_page=1):
    """
    Downloads data from the given URL with basic authentication, paginates through all pages starting from a custom page,
    and appends the new data to an existing JSON file.
    """
    all_new_data = []
    page = start_page
    total_pages = 1  # Initialize to 1, will be updated from the first response.

    headers = {
        "Authorization": f'Basic {auth_key}'
    }

    # Get the total pages from the first page
    try:
        first_page_url = f"{url}&page=1"
        first_response = requests.get(first_page_url, headers=headers)
        first_response.raise_for_status()
        total_pages = first_response.json().get("last_page", 1)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching total pages: {e}")
        return  # Exit if we can't get total pages

    # Validate start_page
    if start_page > total_pages:
        print(f"Error: start_page ({start_page}) is greater than total_pages ({total_pages}).")
        return

    while page <= total_pages:
        print(f"Attempting to download page: {page}")
        current_url = f"{url}&page={page}"
        try:
            response = requests.get(current_url, headers=headers)
            response.raise_for_status()

            data = response.json()
            all_new_data.extend(data.get("data", []))

            page += 1

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from page {page}: {e}")
            break

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from page {page}: {e}")
            break

        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break

    if all_new_data:
        try:
            if os.path.exists(output_file):
                with open(output_file, "r", encoding="utf-8") as f:
                    existing_data = json.load(f)
                existing_data["data"].extend(all_new_data)
                existing_data["to"] = len(existing_data["data"])
                existing_data["last_page"] = total_pages

                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(existing_data, f, ensure_ascii=False, indent=4)
                print(f"New data appended to {output_file}")
            else:
                first_page_response = requests.get(f"{url}&page=1", headers=headers)
                first_page_response.raise_for_status()
                first_page_data = first_page_response.json()

                final_output = {
                    "total": first_page_data.get("total", 0),
                    "per_page": first_page_data.get("per_page", 0),
                    "current_page": 1,
                    "last_page": total_pages,
                    "from": 1,
                    "to": len(all_new_data),
                    "data": all_new_data
                }
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(final_output, f, ensure_ascii=False, indent=4)
                print(f"Data saved to {output_file}")

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from page 1 to get total: {e}")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from page 1 to get total: {e}")
        except Exception as e:
            print(f"An unexpected error occurred while processing the first page's data: {e}")

    else:
        print("No new data was downloaded.")

if __name__ == "__main__":
    relation = 'customer'
    url = f"https://api.bergenchamber.netflexapp.com/v1/search?relation={relation}&page=1&order=created&dir=desc&size=1000&q=*&fields=*"
    start_page = 1
    download_and_append_data(url, f'{relation}.json', start_page)
    