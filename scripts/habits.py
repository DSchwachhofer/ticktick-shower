class Habits():
    def __init__(self):
        pass
    
    def read_habits_data(self):
        with open("./assets/data/habits-data.json", mode="r") as file:
            habits_data = file.read()
            # find way to calculate percentages for each habit
            return habits_data

