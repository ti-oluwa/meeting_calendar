# Generated by Django 5.0.4 on 2024-04-20 03:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_useraccount__old_password_useraccount_old_pwd'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='useraccount',
            name='old_pwd',
        ),
    ]
