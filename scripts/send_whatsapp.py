import requests
import logging
import os
from dotenv import load_dotenv
load_dotenv()

# init logger
logger = logging.getLogger("ticktick_logger")

PARAMS = {
    "phone": os.getenv("WHATS_APP_PHONE"),
    "apikey": os.getenv("WHATS_APP_API_KEY"),
    "text": "your break is over, start working again!"
}

class SendWhatsApp():
    def __init__(self):
        pass
    
    def send_message(self):
        response = requests.get(url="https://api.callmebot.com/whatsapp.php", params=PARAMS)
        print("Sending what's app message", response)
        logger.info(f"Sending what's app message: {response}")

