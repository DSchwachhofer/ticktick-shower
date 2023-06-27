import requests
import os
import logging
from termcolor import colored
from dotenv import load_dotenv
load_dotenv()

# init logger
logger = logging.getLogger("ticktick_logger")

API_KEY = os.getenv("WEATHER_API_KEY")
LATITUDE = os.getenv("WEATHER_LATITUDE")
LONGITUDE = os.getenv("WEATHER_LONGITUDE")
ENDPOINT = "https://api.openweathermap.org/data/2.5/weather"

params = {
    "lat": LATITUDE,
    "lon": LONGITUDE,
    "units": "metric",
    "appid": API_KEY
}


class WeatherManager():
    def __init__(self):
        pass

    def get_weather(self):
        try:
            response = requests.get(url=ENDPOINT, params=params, timeout=30)
            temp = response.json()["main"]["temp"]
        except requests.exceptions.Timeout:
            print(colored("Request timed out", "red"))
            logger.error("Request timed out")
            return "SERVER ERROR"
        return temp
