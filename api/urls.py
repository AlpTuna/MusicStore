from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('user/',views.getUser.as_view()),
    path('all/',views.allUsers.as_view()),
    path('login/',views.loginRequest.as_view()),
    path('update_user/<int:id>',views.UpdateUser.as_view()),
    path('user_tracks/<int:id>',views.getUserMusic.as_view()),
    path('get_user_licenses/<int:userID>',views.getUserLicences.as_view()),
    path('user_notifications/<int:id>',views.getNotifications.as_view()),
    path('get_messages/',views.message.as_view()),
    
    path('get_cart/<int:userID>',views.getCart.as_view()),
    path('update_cart/<str:mode>',views.updateCart.as_view()),

    path('music/',views.allMusic.as_view()),
    path('search_music/',views.searchSongs.as_view()),
    path('similar_songs/<int:songID>',views.getSimilarSongs.as_view()),
    path('get_music/<int:id>',views.getSong.as_view()),
    path('create_music/',views.createMusic.as_view()),
    path('add_comment/',views.addComment.as_view()), # Add remove like
    path('like/<str:mode>',views.addLike.as_view()),  # Add remove comment

    path('follower/<str:mode>',views.followRequest.as_view()),
    path('get_followers/<int:id>',views.getFollowers.as_view()),
    

    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]