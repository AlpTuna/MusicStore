from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    image = models.ImageField(upload_to="frontend/src/images/profile-pics")
    description = models.TextField('Description', max_length=300, default = '', blank = True)
    country = models.CharField(max_length=120, null=True)
    plays = models.PositiveIntegerField(default=0)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
class Subscription(models.Model):
    owner = models.ForeignKey(User, related_name="subscription", on_delete= models.CASCADE)
    name = models.CharField(max_length=10, choices=(('Free','Free'),('Starter','Starter'),('Premium','Premium')), default='Free')
    
class UserFollowing(models.Model):
    user_id = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    following_user_id = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    class Meta:
        unique_together = ('user_id', 'following_user_id',)

class UserLicense(models.Model):
    name = models.CharField(max_length=120)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    default_price = models.FloatField(null= True, default = None)


class Music(models.Model):
    genres = (('Hip Hop','Hip Hop'),('Pop','Pop'),('R&B','R&B'),('Rock','Rock'),
              ('Electronic','Electronic'),('Lofi','Lofi'),('Drill','Drill'),('Country','Country'))

    moods = (('None','None'),('Angry','Angry'),('Bouncy','Bouncy'),('Calm','Calm'),('Confident','Confident'),
             ('Depressed','Depressed'),('Energetic','Energetic'),('Epic','Epic'),('Evil','Evil'),('Happy','Happy'),
             ('Inspiring','Inspiring'),('Intense','Intense'),('Mellow','Mellow'),('Peaceful','Peaceful'),('Sad','Sad'),
             ('Soulful','Soulful'))
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=80)
    tag1 = models.CharField(max_length=30)
    tag2 = models.CharField(max_length=30)
    tag3 = models.CharField(max_length=30)
    date_published = models.DateField(auto_now_add=True)
    file = models.FileField(upload_to="frontend/src/audio")
    genre = models.CharField(max_length=100, choices=genres)
    mood = models.CharField(max_length=120, choices = moods)
    description = models.TextField(max_length=120)
    bpm = models.IntegerField()
    key = models.TextField(max_length=100)
    image = models.ImageField(default=None, null=True,upload_to="frontend/src/images/music-pics")

    def __str__(self):
        return self.title
    
    def getStr(self):
        return f"{self.title} - {self.title} - [{self.tag1,self.tag2,self.tag3}] - {self.genre} - {self.mood} - {self.description}"
    

class SongLicense(models.Model):
    songID = models.ForeignKey(Music, on_delete=models.CASCADE, related_name="available_licences")
    license_type = models.ForeignKey(UserLicense, on_delete= models.CASCADE)
    price = models.FloatField()
    
    class Meta:
        unique_together = ('songID','license_type')

    def __str__(self):
        return f"{self.songID} - {self.license_type.name}"
    
class Cart(models.Model): #Each user will have a cart ONLY if they added something to it. Empty carts will not be saved
    owner = models.ForeignKey(User, on_delete= models.CASCADE, related_name="cart")
    added_licenses = models.ManyToManyField(SongLicense)

    def __str__(self):
        return f"{self.owner}'s Cart"

class Purchase(models.Model):
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name="purchases")
    
    seller_name = models.CharField(max_length=150)
    seller_email = models.EmailField()
    seller = models.ForeignKey(User, null=True, on_delete=models.SET_NULL,related_name="sales")

    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.customer_name}- #{self.id}"

class Play(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    song = models.ForeignKey(Music, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user} - {self.song}"
    

class Download(models.Model):
    file = models.FileField(upload_to="frontend/src/audio/download-files")
    purchaseID = models.ForeignKey(Purchase, on_delete= models.CASCADE) 

class Notification(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField(default="")
    created = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    types = [('like','like'),('follow','follow'),('repost','repost'),('comment','comment'),('purchase','purchase')]
    notification_type = models.CharField(max_length=20, choices = types)

    def __str__(self):
        return f"{self.owner} - {self.notification_type} {self.created}"
    
class Message(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete = models.CASCADE, related_name="messages_sent")
    receiver = models.ForeignKey(User, on_delete= models.CASCADE, related_name="messages_received")
    context = models.TextField()

    def __str__(self):
        return f"{self.sender} to {self.receiver}"
    
class Playlist(models.Model):
    title = models.CharField(max_length=120)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    songs = models.ManyToManyField(Music)
    privacy = models.CharField(max_length = 20, choices = (('private','private'),('public','public')))

    def __str__(self):
        return f"{self.owner.username}'s {self.title}"    

class Like(models.Model):
    music_id = models.ForeignKey(Music, on_delete=models.CASCADE, related_name="likes")
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'music_id',)
    def __str__(self):
        return f"{self.music_id} - {self.user_id}"

class Comment(models.Model):
    music_id = models.ForeignKey(Music, on_delete=models.CASCADE, related_name="comments")
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    context = models.TextField(default="")

    def __str__(self):
        return self.context