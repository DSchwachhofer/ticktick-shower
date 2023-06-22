import requests
import os
from dotenv import load_dotenv
load_dotenv()

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
        response = requests.get(url=ENDPOINT, params=params)
        temp = response.json()["main"]["temp"]
        return temp
