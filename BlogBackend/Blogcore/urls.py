from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from .views import  PostListView, RegisterView, UserView,  CustomTokenObtainPairView, PostCreateView,PostDetailView,CategoryListView,PostByCategoryView
from .views import  ProfileDetailView,ProfileUpdateView,UserPostDetailView,UserPostsListCreateView,UserPostEditView,CommentListCreate
from .views import   BookmarkedPostsListView,RecentPostsListView,FeaturedPostsView,ProfileView,PopularPostsView,TrendingPostsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/<int:pk>/', UserView.as_view(), name='user-detail'),

    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<int:category_id>/posts/', PostByCategoryView.as_view(), name='post-by-category'),
    # path('tags/', TagListView.as_view(), name='tag-list'),
    # path('tags/<int:id>/posts/', PostsByTagIdView.as_view(), name='posts-by-tag-id'),
    path('posts/', PostCreateView.as_view(), name='post-create'),
    path('posts/<slug:slug>/', PostDetailView.as_view(), name='post-detail'),
    path('recent-posts/', RecentPostsListView.as_view(), name='recent-posts'),
    path('featured-posts/', FeaturedPostsView.as_view(), name='featured-posts'),
    path('popular-posts/', PopularPostsView.as_view(), name='popular-posts'),
    path('trending-posts/', TrendingPostsView.as_view(), name='trending-posts'),

    path('posts/<slug:slug>/like/', views.like_post, name='like_post'),
    path('posts/<slug:slug>/bookmark/', views.bookmark_post, name='bookmark_post'),
    path('posts/<slug:slug>/view/', views.add_view, name='add_view'),

    path('profile/', ProfileDetailView.as_view(), name='profile-detail'),
    path('profiles/', ProfileView.as_view(), name='profile-detail'),

    path('profile/edit/', ProfileUpdateView.as_view(), name='profile-edit'),

    path('user/posts/', UserPostsListCreateView.as_view(), name='user-posts-list-create'),
    path('user/posts/<slug:slug>/', UserPostDetailView.as_view(), name='user-post-detail'),
    path('posts/<slug:slug>/edit/', UserPostEditView.as_view(), name='post-edit'),
    path('comments/user_posts/',views. UserPostCommentListAPIView.as_view(), name='user-posts-comment-list'),

    path('comments/create/<int:pk>/', CommentListCreate.as_view(), name='comment-list-create'),
    path('comments/', views.CommentListAPIView.as_view(), name='comment-list'),

    path('bookmarked-posts/', BookmarkedPostsListView.as_view(), name='bookmarked-posts'),

    path('posts/search/', views.PostSearchView.as_view(), name='post-search'),
    path('posts/all/', PostListView.as_view(), name='post-list'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)