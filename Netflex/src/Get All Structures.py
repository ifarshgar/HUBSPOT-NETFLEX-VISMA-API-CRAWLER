import requests
import json
import os
from dotenv import load_dotenv


load_dotenv()

auth_key = os.getenv('NETFLEX_AUTH_USERNAME_PASSWORD')
if not auth_key:
    raise ValueError("NETFLEX_AUTH_USERNAME_PASSWORD environment variable not set")



def fetch_and_save_structure_data(url_template, structures_data):
    """
    Fetches data for each structure ID and saves it to a separate JSON file.

    Args:
        url_template (str): The URL template with {{id}} placeholder.
        structures_data (list): A list of dictionaries containing structure information.
    """

    headers = {
        "Authorization": f'Basic {auth_key}'
    }

    for structure in structures_data:
        structure_id = structure["id"]
        url = url_template.replace("{{id}}", structure_id)

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            data = response.json()

            # Create a filename based on the structure ID
            filename = f"structure_{structure_id}.json"

            # Save the data to a JSON file
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)  #ensure_ascii=False to handle non ascii characters

            print(f"Data for structure ID {structure_id} saved to {filename}")

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data for structure ID {structure_id}: {e}")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON for structure ID {structure_id}: {e}")
        except Exception as e:
            print(f"An unexpected error occured for structure ID {structure_id}: {e}")

def main():
    """
    Main function to load the JSON data from Structures.json and call the fetch and save function.
    """
    url_template = "https://api.bergenchamber.netflexapp.com/v1/builder/structures/{{id}}"

    try:
        with open("./Netflex/json/Structures.json", "r", encoding="utf-8") as f:
            structures_data = json.load(f)
    except FileNotFoundError:
        print("Error: Structures.json file not found.")
        return
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in Structures.json.")
        return
    except Exception as e:
        print(f"An unexpected error occurred while reading Structures.json: {e}")
        return

    fetch_and_save_structure_data(url_template, structures_data)

if __name__ == "__main__":
    main()