from scripts.tick_api_manager import TickTick
from scripts.solar_manager import SolarManager
from scripts.weather_manager import WeatherManager
from scripts.send_whatsapp import SendWhatsApp
import http.server
import socketserver
import json
try:
    import netifaces
except ImportError:
    print("Netifaces module not found. Continuing execution.")
import asyncio
import datetime as dt
import threading
import urllib.parse
import os
import logging
from logging.handlers import TimedRotatingFileHandler

from dotenv import load_dotenv
load_dotenv()

tick = TickTick()
solar = SolarManager()
weather = WeatherManager()
send_whats_app = SendWhatsApp()

tasks = []
temp = 0
power = -1


# configure logging module
logger = logging.getLogger("ticktick_logger")
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s %(name)s - %(levelname)s - %(message)s")
handler = TimedRotatingFileHandler("app.log", when="midnight", backupCount=3)
handler.setFormatter(formatter)
logger.addHandler(handler)


def create_time_message():
    now = dt.datetime.now()
    current_time = now.strftime("%c")
    return f"[{current_time}] : "

def set_ticktick_update_countdown():
    # get current time
    hour = dt.datetime.now().hour
    if hour < 5:
        print(f"{create_time_message()}Setting TickTick update interval to 15 minutes")
        logger.info("Setting TickTick update interval to 15 minutes")
        return 900
    else:
        print(f"{create_time_message()}Setting TickTick update interval to 10 seconds")
        logger.info("Setting TickTick update interval to 10 seconds")
        return 10


async def check_tasks_per():
    while True:
        countdown = set_ticktick_update_countdown()
        global tasks
        # create second fresh list with every run
        # is also used to remove task whichare removed in ticktick app
        tasks_backup = []
        print(f"{create_time_message()}getting tasks from ticktick server")
        logger.info("getting tasks from ticktick server")
        async for task in tick.get_task_list():
            # error, can't get project list
            if task["id"] == "":
                tasks = []
                tasks.append(task)
                countdown = 900
            # start with empty project list
            elif not tasks:
                tasks.append(task)
            else:
                # First, check if the task is in the list
                if any(task_el["id"] == task["id"] for task_el in tasks):
                    # If it is, update it
                    tasks[:] = [task_el if task_el["id"] !=
                                task["id"] else task for task_el in tasks]
                else:
                    # If it's not, add it
                    tasks.append(task)
            tasks_backup.append(task)
            print(f"{create_time_message()}updating tasklist")
            logger.info("updating tasklist")
        tasks[:] = [task for task in tasks_backup]
        await asyncio.sleep(countdown)


async def check_weather_per():
    while True:
        global temp
        print(f"{create_time_message()}getting weather_data from open weather server")
        logger.info("getting weather_data from open weather server")
        temp = weather.get_weather()
        print(f"{create_time_message()}updating weather")
        logger.info("updating weather")
        # SEND WEATHER DATA TO CLIENTS
        print(f"{create_time_message()}temp: {temp}°C")
        logger.info(f"temp: {temp}°C")
        await asyncio.sleep(60)


async def get_power_async():
    loop = asyncio.get_event_loop()
    future = loop.run_in_executor(None, solar.get_power)
    power = await future
    return power

async def check_solar_power_per():
    while True:
        global power
        print(f"{create_time_message()}getting power data from solar edge server")
        logger.info("getting power data from solar edge server")
        try:
            power = await asyncio.wait_for(get_power_async(), timeout=30.0)
        except asyncio.TimeoutError:
            print(f"{create_time_message()}Fetching power data from solar edge server timed out.")
            logger.error("Fetching power data from solar edge server timed out.")
            power = -1
        print(f"{create_time_message()}updating power")
        logger.info("updating power")
        # SEND SOLAR TO CLIENTS
        if power != -1:
            print(f"{create_time_message()}power: {power}kwh")
            logger.info(f"power: {power}kwh")
        else:
            print(f"{create_time_message()}power data not available")
            logger.info("power data not available")
        await asyncio.sleep(300)


PORT = 7000

# Get IP address of local machine on local network
try:
    for interface in netifaces.interfaces():
        addrs = netifaces.ifaddresses(interface)
        if netifaces.AF_INET in addrs:
            ip_address = addrs[netifaces.AF_INET][0]['addr']
            if not ip_address.startswith('127.'):
                break
except:
    ip_address = os.getenv("NAS_IP_ADRESS")
print(ip_address)
logger.info(f"IP_ADRESS: {ip_address}")

with open('ip_address.js', 'w') as f:
    f.write('var ip_address = "{}";'.format(ip_address))


class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        global tasks
        parsed_path = urllib.parse.urlparse(self.path)
        if parsed_path.path == "/update":
            # print(f"{create_time_message()}getting updates...")
            update = {
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
            logger.info(f"COMPLETE TASK with ID: {id}")
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            tick.complete_task(id, project_id)
            tasks[:] = [
                task_el for task_el in tasks if task_el["id"] != id]
        elif parsed_path.path == "/sendmessage":
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            send_whats_app.send_message()
        else:
            # serve files as usual
            super().do_GET()


def start_server():
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        logger.info(f"serving at port {PORT}")
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
