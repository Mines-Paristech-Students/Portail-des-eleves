# Generated by Django 2.2.10 on 2020-04-29 23:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='form',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='course', to='courses.Form'),
        ),
        migrations.AlterField(
            model_name='coursemedia',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='coursemedia',
            name='name',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterField(
            model_name='question',
            name='form',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='question', to='courses.Form'),
        ),
    ]