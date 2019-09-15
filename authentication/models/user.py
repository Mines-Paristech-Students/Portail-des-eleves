from datetime import date

from django.conf import settings
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


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
    id = models.CharField(primary_key=True, max_length=30)

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    nickname = models.CharField(max_length=128, blank=True, default="")
    birthday = models.DateField(null=True)
    email = models.EmailField(max_length=160, unique=True)
    promo = models.IntegerField(verbose_name="Promotion",
                                help_text="The last two digits of the User's entrance year at school.")

    phone = models.CharField(max_length=15, blank=True)
    room = models.CharField(max_length=128, blank=True, help_text="Blank if the User is PAM.")
    address = models.CharField(max_length=512, blank=True,
                               help_text="Address outside the Meuh. Blank if the User is not PAM.")
    city_of_origin = models.CharField(max_length=128, blank=True)

    # Education.
    option = models.CharField(max_length=128, blank=True)
    is_ast = models.BooleanField(default=False)
    is_isupfere = models.BooleanField(default=False)
    is_in_gapyear = models.BooleanField(default=False)

    # Life at school.
    sports = models.CharField(max_length=512, blank=True)
    roommate = models.ManyToManyField('self', symmetrical=True, blank=True)
    minesparent = models.ManyToManyField('self', related_name='fillots', symmetrical=False, blank=True)

    # Life on portail
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'birthday']

    class Meta:
        ordering = ['-promo', 'last_name', 'first_name']

    def __str__(self):
        return self.id

    @property
    def is_staff(self):
        return self.is_admin

    @property
    def is_in_first_year(self):
        """Return True iff the User is in her first year at the school, depending on her promotion."""
        today = date.today()

        if today.month >= 8:
            # Between August and December, the new students have the same school year as the current year.
            return self.promo == today.year % 100
        else:
            # Between January and July, the school year of the new students is the current year minus one.
            return self.promo == (today.year % 100) - 1

    @property
    def show_secret(self):
        """Return True iff the User can be shown… the SECRET."""
        if settings.SHOW_TO_FIRST_YEAR_STUDENTS:
            return True
        else:
            return not self.is_in_first_year

    def get_role(self, association):
        for role in self.roles.all():
            if role.association == association:
                return role
        return None
