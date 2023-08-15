import datetime as dt
import json

class Habits():
    def __init__(self):
        pass
    
    
        
    def get_habit_duration(self, repetition, duration):
        day_in_seconds = 60 * 60 * 24
        duration_of_one_repetition = 0
        if duration == "Day":
            duration_of_one_repetition = day_in_seconds
        elif duration == "Week":
            duration_of_one_repetition = day_in_seconds * 7
        elif duration == "Month":
            duration_of_one_repetition = day_in_seconds * 30
        elif duration == "Year":
            duration_of_one_repetition = day_in_seconds * 365

        duration_in_seconds = duration_of_one_repetition / repetition

        return duration_in_seconds
        
    
    def calculate_percentage(self, habit):

        # get time difference between start of habit and current time
        current_time = dt.datetime.now()
        start_time = dt.datetime.fromtimestamp(habit["starttime"])

        time_difference = round((current_time - start_time).total_seconds())

        percentage = time_difference / self.get_habit_duration(habit["repetition"], habit["duration"])

        return percentage
    
    def read_habits_data(self):
        with open("./assets/data/habits-data.json", mode="r") as file:
            habits_data = json.load(file)
            # find way to calculate percentages for each habit
            habits_parsed = json.loads(habits_data)
            calculated_habits = [{**habit, "percentage": self.calculate_percentage(habit)}for habit in habits_parsed]  
            print(calculated_habits)
            return json.dumps(calculated_habits )
        
    def edit_habits(self, edited_habit):
        print("Editing Habit")

        # check if habit id already exists.
        with open("./assets/data/habits-data.json", mode="r") as file:
            habits_data = json.load(file)
            for habit in habits_data:
                if edited_habit["id"] == habit["id"]:
                    current_time = dt.datetime.now()
                    edited_habit["starttime"] = current_time.timestamp()
                    habit = edited_habit
                    return
            habits_data.append(edited_habit)
        with open("./assets/data/habits-data.json", mode="w") as file:
            json.dump(habits_data, file, indent=4)
            

        # create current timestamp only when new habit is created
        
