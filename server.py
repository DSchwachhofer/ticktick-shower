from scripts.tick_api_manager import TickTick
from scripts.solar_manager import SolarManager
from scripts.weather_manager import WeatherManager
import http.server
import socketserver
import json
import netifaces
import asyncio
import datetime as dt
import threading
import urllib.parse
import subprocess
from termcolor import colored
import os

from dotenv import load_dotenv
load_dotenv()

tick = TickTick()
solar = SolarManager()
weather = WeatherManager()

connected_clients = []

tasks = []
temp = 0
power = -1


def create_time_message():
    now = dt.datetime.now()
    current_time = now.strftime("%c")
    return f"[{current_time}] : "


def is_dark_mode():
    try:
        theme = subprocess.check_output(
            ['defaults', 'read', '-g', 'AppleInterfaceStyle'],
            stderr=subprocess.DEVNULL,
        ).decode().strip()
        # print("dark mode")
        return "dark"
    except subprocess.CalledProcessError:
        # CalledProcessError is raised if 'defaults read -g AppleInterfaceStyle' fails.
        # This is the case when the OS is in light mode because the AppleInterfaceStyle key doesn't exist.
        print("light mode")
        return "light"


async def check_tasks_per():
    while True:
        global tasks
        print(f"{create_time_message()}getting tasks from ticktick server")
        tasks = await tick.get_task_list()
        print(f"{create_time_message()}updating tasklist")
        # SEND TASK LIST TO CLIENTS
        # print(f"{create_time_message()}tasks: {tasks}")
        await asyncio.sleep(10)


async def check_weather_per():
    while True:
        global temp
        print(f"{create_time_message()}getting weather_data from open weather server")
        temp = weather.get_weather()
        print(f"{create_time_message()}updating weather")
        # SEND WEATHER DATA TO CLIENTS
        print(f"{create_time_message()}temp: {temp}°C")
        await asyncio.sleep(60)


async def check_solar_power_per():
    while True:
        global power
        print(f"{create_time_message()}getting power data from solar edge server")
        power = solar.get_power()
        print(f"{create_time_message()}updating power")
        # SEND SOLAR TO CLIENTS
        print(f"{create_time_message()}power: {power}kwh")
        await asyncio.sleep(300)


PORT = 7000

# Get IP address of local machine on local network
for interface in netifaces.interfaces():
    addrs = netifaces.ifaddresses(interface)
    if netifaces.AF_INET in addrs:
        ip_address = addrs[netifaces.AF_INET][0]['addr']
        if not ip_address.startswith('127.'):
            break
print(ip_address)

with open('ip_address.js', 'w') as f:
    f.write('var ip_address = "{}";'.format(ip_address))


class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        global tasks
        parsed_path = urllib.parse.urlparse(self.path)
        if parsed_path.path == "/update":
            # print(f"{create_time_message()}getting updates...")
            update = {
                "dark_mode": is_dark_mode(),
                "task_list": tasks,
                "power": power,
                "temp": temp
            }
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            data = json.dumps(update).encode('utf-8')
            self.wfile.write(data)
        elif parsed_path.path == "/completetask":
            id = urllib.parse.parse_qs(parsed_path.query)["id"][0]
            project_id = urllib.parse.parse_qs(
                parsed_path.query)["projectid"][0]
            print(f"{create_time_message()}COMPLETE TASK with ID: {id}")
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            tick.complete_task(id, project_id)
            # tasks = tick.get_task_list()
        else:
            # serve files as usual
            super().do_GET()


def start_server():
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        print("serving at port", PORT)
        httpd.serve_forever()


async def main():
    loop = asyncio.get_event_loop()

    server_thread = threading.Thread(target=start_server)
    server_thread.start()

    tasks = [
        loop.create_task(check_tasks_per()),
        loop.create_task(check_weather_per()),
        loop.create_task(check_solar_power_per())
    ]

    await asyncio.wait(tasks)

asyncio.run(main())
