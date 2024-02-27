from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.User)
admin.site.register(models.Notification)
admin.site.register(models.UserLicense)
admin.site.register(models.UserFollowing)
admin.site.register(models.Comment)
admin.site.register(models.Message)
admin.site.register(models.Subscription)
admin.site.register(models.Playlist)
admin.site.register(models.Like)

admin.site.register(models.Music)
admin.site.register(models.SongLicense)
admin.site.register(models.Purchase)
admin.site.register(models.Download)
admin.site.register(models.Cart)
admin.site.register(models.Play)