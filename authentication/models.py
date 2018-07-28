from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)


class UserManager(BaseUserManager):
    def create_user(self, pseudo, first_name, last_name, email, password, date_of_birth):
        """
        Creates and saves a User
        """
        return self._create_user(pseudo, first_name, last_name, email, password, date_of_birth, is_admin=False)

    def create_superuser(self, pseudo, first_name, last_name, email, password, date_of_birth):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        return self._create_user(pseudo, first_name, last_name, email, password, date_of_birth, is_admin=True)

    def _create_user(self, pseudo, first_name, last_name, email, password, date_of_birth, is_admin):
        """
        Creates and saves a User
        """
        user = self.model(
            pseudo=pseudo,
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            date_of_birth=date_of_birth,
        )

        user.set_password(password)
        if is_admin:
            user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    pseudo = models.CharField(primary_key=True, max_length=30, verbose_name="User pseudo")
    first_name = models.CharField(max_length=50, verbose_name="User first name")
    last_name = models.CharField(max_length=50, verbose_name="User last name")

    email = models.EmailField(
        verbose_name='email address',
        max_length=160,
        unique=True,
    )

    nickname = models.CharField(max_length=128, blank=True, default="")
    birthday = models.DateField(null=True, verbose_name="date de naissance")
    gender = models.BooleanField(default=False) # True = Woman , False = Man

    # Contact the person
    phone = models.CharField(max_length=15, blank=True, verbose_name="numéro de téléphone")

    room = models.CharField(max_length=128, blank=True, verbose_name="numéro de chambre")  # null if the person is PAM
    address = models.CharField(max_length=512, blank=True, help_text="adresse en dehors de la Meuh")  # null if the person is not PAM
    city_of_origin = models.CharField(max_length=128, blank=True, help_text="ville d'origine")

    # Cursus
    option = models.CharField(max_length=128, blank=True)
    is_ast = models.BooleanField(default=False)
    is_isupfere = models.BooleanField(default=False)
    is_in_gapyear = models.BooleanField(default=False)

    # Life in Mines
    sports = models.CharField(max_length=512, blank=True)
    roommate = models.ManyToManyField('self', symmetrical=True, blank=True)
    minesparent = models.ManyToManyField('self', related_name='fillots', symmetrical=False, blank=True) # the Mines godparent

    # Life on portail

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'pseudo'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'date_of_birth']

    def __str__(self):
        return self.pseudo

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
