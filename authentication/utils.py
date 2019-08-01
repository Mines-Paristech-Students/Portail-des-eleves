import json
from datetime import date, timedelta


class Birthday:
    """Utils class to represent, sort, index and compare birthdays
    """

    def __init__(self, day, month, year=1900):
        if not isinstance(day, int) or day <= 0:
            raise ValueError("day parameter must be a positive int")
        if not isinstance(month, int) or month <= 0:
            raise ValueError("month parameter must be a positive int")
        if not isinstance(year, int) or year <= 0:
            raise ValueError("year parameter must be a positive int")
        self._date = date(day=day, month=month, year=year)

    @property
    def day(self):
        return self._date.day

    @property
    def month(self):
        return self._date.month

    @staticmethod
    def from_date(d):
        return Birthday(d.day, d.month, d.year)

    @staticmethod
    def from_datetime(d):
        return Birthday.from_date(d)

    def __eq__(self, other):
        return isinstance(other, Birthday) and self.day == other.day and self.month == other.month

    def __ne__(self, other):
        return not self.__eq__(other)

    def __gt__(self, other):
        if not isinstance(other, Birthday):
            raise TypeError("Invalid comparison")

        if self.month > other.month:
            return True
        elif self.month == other.month:
            return self.day > other.day
        else:  # self.month < other.month
            return False

    def __ge__(self, other):
        if not isinstance(other, Birthday):
            raise TypeError("Invalid comparison")

        if self.month > other.month:
            return True
        elif self.month == other.month:
            return self.day >= other.day
        else:  # self.month < other.month
            return False

    def __lt__(self, other):
        return other.__gt__(self)

    def __le__(self, other):
        return other.__ge__(self)

    def __repr__(self):
        """String representation of the object for debug purposes"""
        return "Birthday(day={}, month={})".format(self.day, self.month)

    def __str__(self):
        return self.__repr__()

    def __hash__(self):
        return hash((self.day, self.month))

    def inc(self, step=1):
        self._date += timedelta(days=step)

    def isoformat(self):
        return self._date.isoformat()


class BirthdaysEncoder(json.JSONEncoder):
    def _encode(self, obj):
        # obj must be of type dict
        returned_json = {"birthdays": []}
        for k, v in obj.items():
            # k must be of type Birthday
            dic = {
                "date": date(day=k.day, month=k.month, year=2000).isoformat(),
                "users": v
            }
            returned_json["birthdays"].append(dic)
        return returned_json

    def encode(self, obj):
        return super(BirthdaysEncoder, self).encode(self._encode(obj))
