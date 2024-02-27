# Generated by Django 4.2.6 on 2023-10-24 14:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_alter_songlicense_unique_together"),
    ]

    operations = [
        migrations.AlterField(
            model_name="music",
            name="image",
            field=models.ImageField(
                default=None, null=True, upload_to="frontend/src/images/music-pics"
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="image",
            field=models.ImageField(upload_to="frontend/src/images/profile-pics"),
        ),
        migrations.CreateModel(
            name="Purchase",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("customer_name", models.CharField(max_length=150)),
                ("customer_email", models.EmailField(max_length=254)),
                ("seller_name", models.CharField(max_length=150)),
                ("seller_email", models.EmailField(max_length=254)),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "customer",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="purchases",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "seller",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="sales",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Download",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "file",
                    models.FileField(upload_to="frontend/src/audio/download-files"),
                ),
                (
                    "purchaseID",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.purchase"
                    ),
                ),
            ],
        ),
    ]