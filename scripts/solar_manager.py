import solaredge
import os
from dotenv import load_dotenv
load_dotenv()


API_KEY = os.getenv("SOLAR_API_KEY")
SITE_ID = os.getenv("SOLAR_SITE_ID")


class SolarManager():
    def __init__(self):
        pass

    def get_power(self):
        s = solaredge.Solaredge(API_KEY)
        data = s.get_current_power_flow(SITE_ID)
        # print(data)
        power_difference = data["siteCurrentPowerFlow"]["PV"]["currentPower"] - data["siteCurrentPowerFlow"]["LOAD"]["currentPower"]
        return power_difference
