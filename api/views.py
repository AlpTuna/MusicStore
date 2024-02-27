from django.shortcuts import render
from .models import User,Music,UserLicense,SongLicense,UserFollowing, Notification, Comment, Like, Cart, Message
from .serializers import UserSerializer, MusicSerializer, UserLicenseSerializer, SongLicenseSerializer, NotificationSerializer, CommentSerializer, LikeSerializer, MessageSeriazlier
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status
from datetime import datetime
from .utils import getSongSimilarity,getSongAsDict

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = user.username
        token['user_id'] = user.id
        token['following'] = [x.id for x in user.following.all()]
        token['followers'] = [x.id for x in user.followers.all()]
        token['image'] = str(user.image)
        token['full_name'] = user.first_name + " " +user.last_name
        token['description'] = user.description

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class allUsers(APIView):
    def get(self,request):
        print(request)
        items = User.objects.all()
        items = UserSerializer(items,many=True)
        return Response(items.data)
    
class allMusic(APIView):
    def get(self,request):
        items = Music.objects.all()
        items = MusicSerializer(items,many=True)
        return Response(items.data)
    
class getUserLicences(APIView):
    def get(self,request,userID):
        if len(User.objects.filter(id=userID)) < 1:
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        licences = UserLicense.objects.filter(user=userID)
        licences = UserLicenseSerializer(licences,many = True)
        return Response(licences.data, status=status.HTTP_200_OK)

class getSong(APIView):
    def get(self,request,id):
        song = Music.objects.filter(id = id)
        if len(song) < 1:
            return Response({"message":"Song not found"},status=status.HTTP_404_NOT_FOUND)
        else:
            print(song[0].owner)
            song = MusicSerializer(song[0])
            return Response(song.data,status=status.HTTP_200_OK)
        
class getFollowers(APIView):
    def get(self,request,id):
        user = User.objects.filter(id = id)
        if len(user) < 1:
            return Response({"message":"User not found"},status = status.HTTP_404_NOT_FOUND)
        else:
            followers = user[0].followers.all()
            followers = [x.user_id for x in followers]
            followers = UserSerializer(followers,many = True)
            return Response(followers.data, status= status.HTTP_200_OK)
        
class addComment(APIView):
    def post(self,request):
        # INPUT: userID, context
        print("data received: ",request.data)
        song = Music.objects.filter(id = request.data.get("songID"))
        user = User.objects.filter(id = request.data.get("userID"))
        context = request.data.get("context")
        if len(song) < 1:
            return Response({"message":"Song not found"},status = status.HTTP_404_NOT_FOUND)
        if len(user) < 1:
            return Response({"message":"User not found"}, status = status.HTTP_404_NOT_FOUND)
        if len(context.replace(' ','')) == 0: # Empty comment will not be accepted
            return Response({"message":"Comment cannot be empty"}, status = status.HTTP_400_BAD_REQUEST)
        song = song[0]
        user = user[0]
        newComment = Comment.objects.create(user_id = user, music_id = song, context =context)
        newComment = CommentSerializer(newComment)
        return Response(newComment.data, status = status.HTTP_200_OK)


class getNotifications(APIView):
    def get(self,request,id):
        print(request.data.get("ttt"))
        user = User.objects.filter(id = id)
        if len(user) < 1:
            return Response({"message":"User not found"},status = status.HTTP_404_NOT_FOUND)
        else:
            notifications = Notification.objects.filter(owner = id)
            notifications = NotificationSerializer(notifications, many=True)
            return Response(notifications.data, status= status.HTTP_200_OK)
        
class getSimilarSongs(APIView):
    def get(self, request, songID):
        count = 20
        params = ["genre","tag1","tag2","tag3","mood"]
        music = Music.objects.filter(id = songID)
        if len(music) < 1:
            return Response({"message":"Song not found"}, status = status.HTTP_404_NOT_FOUND)
        music = music[0]
        query = Music.objects.filter(genre = music.genre).exclude(id = songID)

        i = 1
        while len(query) > count and i<len(params):
            new_query = query.filter(**{params[i] : getattr(music,params[i])})
            if len(new_query) >= count:
                query = new_query
            i += 1
        
        songScores = {}
        for x in query[:count]:
            songScores[x] = getSongSimilarity(getSongAsDict(x),getSongAsDict(music))
        songScores = dict(sorted(songScores.items(), key=lambda item: item[1], reverse=True))
        print(songScores)
        results = MusicSerializer([x for x in songScores],many = True)
        return Response(results.data, status = status.HTTP_200_OK)


class addLike(APIView):
    # INPUT: userID
    def post(self,request,mode):
        music = Music.objects.filter(id = request.data.get('songID'))
        user = User.objects.filter(id = request.data.get("userID"))
        if len(music) == 0:
            return Response({"message":"Music not found"},status = status.HTTP_404_NOT_FOUND)
        if len(user) == 0:
            return Response({"message":"User not found"},status = status.HTTP_404_NOT_FOUND)
        
        music = music[0]
        user = user[0]

        print(music, user, mode)
        if mode == 'add':
            if Like.objects.filter(music_id = music, user_id = user):
                return Response({"message":"User already likes the song"},status = status.HTTP_400_BAD_REQUEST)
            like = Like.objects.create(music_id = music, user_id = user)
            like = LikeSerializer(like)
            return Response({"message":"Added like"},status = status.HTTP_200_OK)
        elif mode == "remove":
            if len(Like.objects.filter(music_id = music, user_id = user)) > 0:
                Like.objects.get(music_id = music, user_id = user).delete()
                return Response({"message":"Like removed !"}, status = status.HTTP_200_OK)
            return Response({"message":"User already doesn't like the song"},status = status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message":"Unknown request"}, status = status.HTTP_400_BAD_REQUEST)

class followRequest(APIView):
    def post(self,request,mode):
        user1 = User.objects.filter(id = request.data.get("from"))
        user2 = User.objects.filter(id = request.data.get("to"))

        if len(user1) > 0  and len(user2) > 0:
            user1 = user1[0]
            user2 = user2[0]

            if user1.id == user2.id:
                return Response({"message":"User cannot follow themselves"},status = status.HTTP_400_BAD_REQUEST)
            
            if mode=="follow":
                if len(UserFollowing.objects.filter(user_id = user1, following_user_id = user2)) > 0:
                    return Response({"message":"User following already"},status = status.HTTP_400_BAD_REQUEST)
                UserFollowing.objects.create(user_id = user1, following_user_id = user2)
                
                prevFollowNotification = Notification.objects.filter(owner = user2, notification_type = "follow", message__startswith = str(user1.username))
                if len(prevFollowNotification) > 0:
                    prevFollowNotification[0].created = datetime.now()
                    prevFollowNotification[0].save()
                else:
                    Notification.objects.create(owner = user2, message = f"{user1.username} is now following you!",notification_type = "follow")
                return Response({"message":"Follow successfull"},status = status.HTTP_200_OK)
            
            elif mode=="unfollow":
                follow = UserFollowing.objects.filter(user_id = user1, following_user_id = user2)
                if len(follow) > 0:
                    follow[0].delete()
                    return Response({"message":"Unfollow successfull"},status = status.HTTP_200_OK)
                else:
                    return Response({"message":"User not following already"},status = status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message":"User not found"},status = status.HTTP_404_NOT_FOUND)
        
class message(APIView):
    def get(self, request):
        print(request.user)
        if request.GET.get("mode") == "all":
            user = User.objects.filter(id = request.GET.get("user"))
            if len(user) > 0:
                messages = Message.objects.filter(sender = user[0]) | Message.objects.filter(receiver = user[0])
                profiles = set()
                for x in messages:
                    profiles.add(x.sender)
                    profiles.add(x.receiver)
                profiles.discard(user[0])
                print(profiles)
                profiles = UserSerializer(profiles,many = True)
                return Response(profiles.data, status = status.HTTP_200_OK)
            return Response({"message":"User not found"}, status = status.HTTP_404_NOT_FOUND)
        elif request.GET.get("mode") == "chat":
            user1, user2 = User.objects.filter(id = request.GET.get('user1')), User.objects.filter(id = request.GET.get('user2'))
            if len(user1) > 0 and len(user2) > 0:
                messages = Message.objects.filter(sender = user2[0], receiver = user1[0]) | Message.objects.filter(sender = user1[0], receiver = user2[0])
                messages = messages.order_by('date')
                messages = MessageSeriazlier(messages, many = True)
                return Response(messages.data, status = status.HTTP_200_OK)
            return Response({"message":"User not found"}, status = status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message":"Unknown request (change 'mode')"}, status = status.HTTP_400_BAD_REQUEST)
        
    def post(self, request):
        sender, receiver = User.objects.filter(id = request.data.get('sender')), User.objects.filter(id = request.data.get('receiver'))
        if len(sender) > 0 and len(receiver) > 0:
            message = Message.objects.create(sender = sender[0], receiver = receiver[0], context = request.data.get("context"))
            message = MessageSeriazlier(message)
            return Response(message.data, status = status.HTTP_200_OK)
        return Response({"message":"User not found"}, status = status.HTTP_404_NOT_FOUND)


class UpdateUser(APIView):
    def post(self,request,id):
        user = User.objects.filter(id = id)
        if len(user) == 0:
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            user = user[0]
            for attribute in request.data:
                setattr(user, attribute, request.data.get(attribute))
            user.save()
            return Response({"message":"User updated!"}, status = status.HTTP_200_OK)
        
class searchSongs(APIView):
    def get(self, request):
        genre = request.GET.get('genre')
        keyword = request.GET.get('keyword')
        tag = request.GET.get('tag')
        mood = request.GET.get('mood')
        print(genre ,keyword , tag, mood)
        res = Music.objects.all()
        if genre:
            res = [x for x in res if x.genre == genre]
        if mood: 
            res = [x for x in res if x.mood == mood]    
        if keyword:
            res = [x for x in res if keyword.lower() in x.getStr().lower().split(' ')]
        if tag:
            res = [x for x in res if tag in [x.tag1,x.tag2,x.tag3]]
        res = MusicSerializer(res, many = True)
        return Response(res.data , status = status.HTTP_200_OK) 


class updateCart(APIView):   
    def post(self,request,mode):
        user = User.objects.filter(id = request.data.get("userID"))
        songLicense = SongLicense.objects.filter(id = request.data.get('licenseID'))
        if len(songLicense) < 1:
            return Response({"message":"Song couldn't be found"}, status=status.HTTP_404_NOT_FOUND)
        if len(user) == 0:
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        songLicense = songLicense[0]
        cart = Cart.objects.filter(owner = user[0])
        
        # If the user has not added any item to cart
        if len(cart) < 1:
            if mode == "remove":
                return Response({"message":"Cart is already empty"},status = status.HTTP_400_BAD_REQUEST)
            elif mode == "add":
                newCart = Cart.objects.create(owner = user[0])
                newCart.added_licenses.add(songLicense)
                newCart.save()
                items = SongLicenseSerializer(newCart.added_licenses.all(), many = True)
                return Response(items.data, status = status.HTTP_200_OK)

        # If the user has some items in the cart
        if mode == "remove":
            if len(cart[0].added_licenses.all()) > 1: # If there are more than 1 licenses in cart, we just remove
                cart[0].added_licenses.remove(songLicense)
                return Response({"message": "Item removed from cart"}, status =status.HTTP_200_OK)
            else:
                cart[0].delete()
                return Response({"message": "Item deleted. Cart is empty"}, status =status.HTTP_200_OK)
        elif mode == "add":
            sameSongLicences = cart[0].added_licenses.filter(songID = songLicense.songID)
            if len(sameSongLicences) > 0:
                cart[0].added_licenses.remove(sameSongLicences[0])
            cart[0].added_licenses.add(songLicense)
            return Response({"message": "Item added to cart"}, status =status.HTTP_200_OK)

class getCart(APIView):
    def get(self,request,userID):
        user = User.objects.filter(id = userID)
        if len(user) == 0:
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            user = user[0]
            cart = Cart.objects.filter(owner = user)
            if len(cart) > 0:
                items = cart[0].added_licenses
                items = SongLicenseSerializer(items, many = True)
                return Response(items.data , status = status.HTTP_200_OK)
            return Response([], status = status.HTTP_200_OK)
        

class createMusic(APIView):
    def post(self,request):
        print(request.data, request.data.get("image"))
        o = User.objects.get(id = request.POST.get("owner"))
        newMusic = Music.objects.create(
            owner = o,
            title = request.data.get("title"),
            tag1 = request.data.get("tag1"),
            tag2 = request.data.get("tag2"),
            tag3 = request.data.get("tag3"),
            image = request.data.get("image"),
            #date_published = request.POST["date_published"],
            file = request.data.get("audiofile"),
            genre = request.data.get("genre"),
            mood = request.data.get("mood"),
            description = request.data.get("description"),
            bpm = request.data.get("bpm"),
            key = request.data.get("key"),
            )
        print(newMusic)
        if not newMusic:
            print("newMusic is empty")
            return Response({"message":"Could not create a song"},status=status.HTTP_400_BAD_REQUEST)
        newMusic.save()
        newMusic = MusicSerializer(newMusic)
        return Response(newMusic.data,status=status.HTTP_201_CREATED)

class loginRequest(APIView):
    def post(self,request):
        print(request.POST["username"],request.POST["password"])
        user = authenticate(username=request.POST["username"], password=request.POST["password"])
        if user is not None:
            user = UserSerializer(user,many= True)
            return Response(user.data,status = status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class getUserMusic(APIView):
    def get(self,request,id):
        if len(User.objects.filter(id = id)) < 1:
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        music = Music.objects.filter(owner=id)
        music = MusicSerializer(music, many=True)
        return Response(music.data, status=status.HTTP_200_OK)
    
class getUser(APIView):
    def get(self,request):
        username = request.GET.get('username')
        items = User.objects.filter(username = username)
        if len(items) > 0:
            items = UserSerializer(items,many = True)
            return Response(items.data,status=status.HTTP_200_OK)
        else:
            return Response({"message":"User not found"},status = status.HTTP_404_NOT_FOUND)
    def post(self,request):
        print(request.data)
        if len(User.objects.filter(username = request.POST.get("username"))) > 0:
            return Response({"message":"Username already exists."},status=status.HTTP_400_BAD_REQUEST) 
        newUser = User.objects.create_user(
            password = request.data["password"],
            username = request.data["username"],
            first_name = request.data["first_name"],
            last_name = request.data["last_name"],
            email = request.data["email"],
            description = request.data["description"])
        if "image" in request.data:
            newUser.image = request.data["image"]
        newUser.save()
        newUser = UserSerializer(newUser)
        return Response(newUser.data,status=status.HTTP_201_CREATED)