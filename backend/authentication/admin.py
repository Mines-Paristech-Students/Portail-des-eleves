from django.contrib import admin

from authentication.models import User, ProfileQuestion

import ast
import pandas as pd
from django import forms, urls
from django.contrib import admin, messages
from django.http import HttpRequest
from django.shortcuts import redirect, render
from django.urls import path

from django.db import transaction


class CsvImportForm(forms.Form):
    csv_file = forms.FileField()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name")
    change_list_template = "admin/user_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path("update-csv/", self.update_with_csv),
        ]
        return my_urls + urls

    def update_with_csv(self, request: HttpRequest):
        if request.method == "POST":
            csv_file = request.FILES["csv_file"]

            try:
                df = pd.read_csv(csv_file, converters={"audience": ast.literal_eval})
                self.update_users(df)

                self.message_user(request, "Your csv file has been imported!")
                return redirect(urls.reverse("admin:authentication_user_changelist"))
            except Exception as e:
                print(e)
                self.message_user(
                    request,
                    "This file cannot be processed: try another",
                    level=messages.ERROR,
                )
                return redirect(request.path_info)

        form = CsvImportForm()
        payload = {"form": form}
        return render(request, "admin/csv_form.html", payload)

    def update_users(self, df: pd.DataFrame):
        users_to_update = [
            self.get_updated_user(user) for user in df.to_dict("records")
        ]
        with transaction.atomic():
            User.objects.bulk_update(users_to_update, df.columns.drop("id").to_list())

    def get_updated_user(self, user: User) -> User:
        user_to_update = User.objects.get(id=user["id"])
        for field, value in user.items():
            setattr(user_to_update, field, value)
        return user_to_update


@admin.register(ProfileQuestion)
class ProfileQuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "text")
