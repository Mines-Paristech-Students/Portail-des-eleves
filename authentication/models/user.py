from datetime import date

from django.conf import settings
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.functional import cached_property


class UserManager(BaseUserManager):
    def create_user(self, id, first_name, last_name, email, password, birthday, promo):
        """
        Creates and saves a User
        """
        return self._create_user(id, first_name, last_name, email, password, birthday, promo, is_admin=False)

    def create_superuser(self, id, first_name, last_name, email, password, birthday, promo):
        """
        Creates and saves a superuser with the given email, birthday and password.
        """
        return self._create_user(id, first_name, last_name, email, password, birthday, promo, is_admin=True)

    def _create_user(self, id, first_name, last_name, email, password, birthday, promo, is_admin):
        """
        Creates and saves a User
        """
        user = self.model(
            id=id,
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            birthday=birthday,
            promo=promo
        )

        user.set_password(password)
        if is_admin:
            user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    STUDENT_TYPES = (('AST', 'AST'),
                     ('ISUPFERE', 'ISUPFERE'),
                     ('EV', 'EV'),
                     ('IC', 'IC'))

    ACADEMIC_YEARS = (('1A', '1A'),
                      ('2A', '2A'),
                      ('GAP YEAR', 'CÉSURE'),
                      ('3A', '3A'),)

    id = models.CharField(primary_key=True, max_length=30)

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    nickname = models.CharField(max_length=128, blank=True, default="")
    birthday = models.DateField(null=True)
    email = models.EmailField(max_length=160, unique=True)
    year_of_entry = models.IntegerField(validators=(MinValueValidator(1783),))  # The year MINES ParisTech was created.

    phone = models.CharField(max_length=15, blank=True)
    room = models.CharField(max_length=128, blank=True, help_text="Blank if the User is PAM.")
    address = models.CharField(max_length=512, blank=True,
                               help_text="Address outside the Meuh. Blank if the User is not PAM.")
    city_of_origin = models.CharField(max_length=128, blank=True)

    # Education.
    option = models.CharField(max_length=128, blank=True)
    student_type = models.CharField(max_length=10, choices=STUDENT_TYPES)
    current_academic_year = models.CharField(max_length=10, choices=ACADEMIC_YEARS)

    # Life at school.
    sports = models.CharField(max_length=512, blank=True)
    roommate = models.ManyToManyField('self', symmetrical=True, default=None)
    minesparent = models.ManyToManyField('self', related_name='fillots', symmetrical=False, default=None)

    # Life on portail.
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'birthday']

    class Meta:
        ordering = ['-year_of_entry', 'last_name', 'first_name']

    def __str__(self):
        return self.id

    @cached_property
    def is_staff(self):
        return self.is_admin

    @cached_property
    def is_in_first_year(self):
        """Return True iff the User is in their first year at the school, depending on their year of entry."""
        return self.years_since_entry <= 0

    @cached_property
    def promotion(self):
        """The last two digits of the User's entrance year at school."""
        return self.year_of_entry % 100

    @cached_property
    def show(self):
        """Return True iff the User can be shown."""
        if settings.SHOW_TO_FIRST_YEAR_STUDENTS:
            return True
        else:
            return not self.is_in_first_year

    @cached_property
    def years_since_entry(self):
        """
            Return the number of years completed since the student's arrival at school.\n
            A school year begins on 1st September and ends the 30th June. In other words, we are counting the number
            of elapsed 30th June NOT including the one of the arrival year.
        """
        today = date.today()

        if today >= date(today.year, 6, 30):
            # |                 YEAR N-1                 |                  YEAR N                |
            # |-------- 30 June -------- Arrival --------|-------- 30 June -------- TODAY --------|
            # N - (N - 1) = 1 = number of passed 30 June.

            return today.year - self.year_of_entry
        else:
            # |                 YEAR N-1                 |                  YEAR N                |
            # |-------- 30 June -------- Arrival --------|-------- TODAY -------- 30 June --------|
            # Remove one for the 30 June of year N which has not passed yet.

            return today.year - self.year_of_entry - 1

    def get_role(self, association=None, association_pk=None):
        q = None

        if association_pk is not None:
            q = self.roles.filter(association_id=association_pk)
        elif association is not None:
            q = self.roles.filter(association=association)

        if q and q.exists():
            return q[0]

        return None
