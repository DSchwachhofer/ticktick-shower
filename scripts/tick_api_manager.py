import base64
import requests
import webbrowser
import json
import time
from datetime import datetime, timedelta
import asyncio
from termcolor import colored
import os
from dotenv import load_dotenv
load_dotenv()
import logging

CLIENT_ID = os.getenv("TICK_CLIENT_ID")
CLIENT_SECRET = os.getenv("TICK_CLIENT_SECRET")
REDIRECT_URI = os.getenv("TICK_REDIRECT_URI")
ACCESS_TOKEN = os.getenv("TICK_ACCESS_TOKEN")

# init logger
logger = logging.getLogger("ticktick_logger")

SCOPE = "tasks:read tasks:write"  # The permissions your app needs
# This can be any string - it's used to prevent CSRF attacks
STATE = os.getenv("TICK_STATE")

HEADERS = {
    "Authorization": "Bearer " + ACCESS_TOKEN
}


# ------------ FUNCTION FOR GETTING NEW ACCESS TOKEN ------------------
# -> Execute if access token needs to be refreshed
def get_access_token():
    # Step 1: Redirect the user to the TickTick authorization page
    auth_url = f"https://ticktick.com/oauth/authorize?scope={SCOPE}&client_id={CLIENT_ID}&state={STATE}&redirect_uri={REDIRECT_URI}&response_type=code"
    webbrowser.open(auth_url)

    # Step 2: User grants access and is redirected back to your app
    # Here, you'll need to extract the authorization code from the redirected URL
    # This code assumes that you have some way of obtaining the redirected URL
    redirected_url = input("Enter the redirected URL: ")
    auth_code = redirected_url.split("code=")[1].split("&")[0]

    # Step 3: Exchange the authorization code for an access token
    token_url = "https://ticktick.com/oauth/token"

    auth_string = f'{CLIENT_ID}:{CLIENT_SECRET}'
    encoded_auth_string = base64.b64encode(auth_string.encode()).decode()

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Basic {encoded_auth_string}'
    }
    data = {
        'code': auth_code,
        'grant_type': 'authorization_code',
        'scope': SCOPE,
        'redirect_uri': REDIRECT_URI
    }
    response = requests.post(token_url, headers=headers, data=data)
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

    if response.status_code == 200:  # If the request was successful
        access_token = response.json()['access_token']
        print(f"Access token: {access_token}")
    else:
        print("Failed to get access token")


class TickTick():
    def __init__(self):
        pass

    async def get_task_list(self):
        now = datetime.now().date()

        response = requests.get(
            'https://api.ticktick.com/open/v1/project', headers=HEADERS)

        print(colored(
            f"{self.create_time_message()}Fetching list of all projects: {response}", "magenta"))
        logger.info(f"Fetching list of all projects: {response}")
        if response.status_code != 200:
            print(colored(response.text, "red"))
            logger.error(response.text)
            yield {"task_name": "SERVER ERROR", "id": ""}
        else:
            project_list = response.json()
            # print(project_list)
            cleaned_project_list = [
                project for project in project_list if "closed" not in project or project["closed"] == False]
            for item in cleaned_project_list:
                list_response = requests.get(
                    f'https://api.ticktick.com/open/v1/project/{item["id"]}/data', headers=HEADERS)
                print(colored(
                    f"{self.create_time_message()}Fetching tasks for {item['name']}: {list_response}", "magenta"))
                logger.info(f"Fetching tasks for {item['name']}: {list_response}")
                if list_response.status_code != 200:
                    print(colored(list_response.text, "red"))
                    logger.warning(list_response.text)
                project = list_response.json()
                if "tasks" in project:
                    for task in project["tasks"]:
                        if "dueDate" in task:
                            task_to_check_date = {"task_name": task["title"], "due_date": (datetime.strptime(
                                task["dueDate"], "%Y-%m-%dT%H:%M:%S.%f%z") + timedelta(hours=2)).date(), "id": task["id"], "task": task}
                            if now >= task_to_check_date["due_date"]:
                                task_today = {
                                    "task_name": task["title"], "id": task["id"], "project_id": item["id"]}
                                print(colored(task_today, "magenta"))
                                logger.info(task_today)
                                yield task_today
                await asyncio.sleep(2)

    def complete_task(self, id, project_id):
        response = requests.post(
            f'https://api.ticktick.com/open/v1/project/{project_id}/task/{id}/complete', headers=HEADERS)
        print(colored(
            f"{self.create_time_message()}Trying to complete task {response}", "magenta"))
        logger.info( f"Trying to complete task {response}")
        if response.status_code != 200:
            print(colored(response.text, "red"))
            logger.warning(response.text)

    def create_time_message(self):
        now = datetime.now()
        current_time = now.strftime("%c")
        return f"[{current_time}] : "


# tick = TickTick()
# tick.get_task_list()
