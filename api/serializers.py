from rest_framework import serializers
from .models import User, Music, UserLicense, UserFollowing, Notification, Comment, Like, Subscription, SongLicense, Message

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ('owner','name')

class UserFollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowing
        fields = ('user_id','following_user_id')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','email','image',
                  'description','followers','following','country','subscription','plays','verified')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('owner','message','created','notification_type')

class CommentSerializer(serializers.ModelSerializer):
    user_obj = UserSerializer(source = 'user_id')
    class Meta:
        model = Comment
        fields = ('music_id','user_obj','context')

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('user_id','music_id','date')

class UserLicenseSerializer(serializers.ModelSerializer):
    user_obj = UserSerializer(source = 'user')
    class Meta:
        model = UserLicense
        fields = ('name','user','default_price', 'user_obj')


class MessageSeriazlier(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('date','sender','receiver','context')
        
class MusicSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Music
        fields = ('id','owner','title','tag1','tag2','tag3','date_published','file','genre','mood',
                  'description','bpm','key','image')

class SongLicenseSerializer(serializers.ModelSerializer): 
    #This is only used to serialize the song_obj field in MusicSerializer. This solves the problem of circular serialization
    license_obj = UserLicenseSerializer(source = 'license_type')
    song_obj = MusicSerializer2(source = 'songID')
    class Meta:
        model = SongLicense
        fields = ('id','songID','price','license_obj','song_obj')

class MusicSerializer(serializers.ModelSerializer):
    user_obj = UserSerializer(source = 'owner')
    licences = SongLicenseSerializer(source = 'available_licences', many = True)
    comments_obj = CommentSerializer(source = 'comments', many =True)
    likes_obj = LikeSerializer(source = 'likes', many= True)
    class Meta:
        model = Music
        fields = ('id','owner','user_obj','title','tag1','tag2','tag3','date_published','file','genre','mood',
                  'description','bpm','key','image','comments_obj','likes_obj','licences')