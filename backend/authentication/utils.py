from datetime import date, timedelta

from django.http import HttpRequest


class Birthday:
    """Utils class to represent, sort, index and compare birthdays."""

    def __init__(self, day, month, year=1900):
        # The date constructor raises exceptions if the parameters are not consistent.
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
        return (
            isinstance(other, Birthday)
            and self.day == other.day
            and self.month == other.month
        )

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


def get_hostname(request: HttpRequest):
    return request.get_host().split(":")[0]
