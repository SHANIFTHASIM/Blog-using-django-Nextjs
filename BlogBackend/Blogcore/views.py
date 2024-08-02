from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import RegisterSerializer,ProfileSerializer, TagSerializer,UserSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import Post,Category, Tag,View,Like,Bookmark,Profile,Comment
from .serializers import PostSerializer,CategorySerializer,CommentSerializer,FeaturedPostSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.parsers import JSONParser,ParseError
from rest_framework.exceptions import NotFound
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Q, Subquery, OuterRef


User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'user': UserSerializer(self.user).data})
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'

class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@permission_classes([AllowAny])
class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'slug'


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  

@permission_classes([AllowAny])
class PostByCategoryView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return Post.objects.filter(category_id=category_id)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_view(request, slug):
    user = request.user
    post = get_object_or_404(Post, slug=slug)
    
    if 'viewed_post_{}'.format(post.id) not in request.session:
        post.views += 1
        post.save()
        request.session['viewed_post_{}'.format(post.id)] = True
        message = 'View added successfully.'
    else:
        message = 'View already counted.'

    return Response({'message': message})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, slug):
    post = get_object_or_404(Post, slug=slug)
    like, created = Like.objects.get_or_create(user=request.user, post=post)
    if created:
        message = 'Post liked successfully.'
    else:
        like.delete()
        message = 'Post unliked successfully.'
    return Response({'message': message})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bookmark_post(request, slug):
    try:
        post = get_object_or_404(Post, slug=slug)
        user = request.user
        bookmark, created = Bookmark.objects.get_or_create(user=user, post=post)
        if not created:
            bookmark.delete()
            message = 'Post removed from bookmarks.'
        else:
            message = 'Post bookmarked successfully.'
        return Response({'message': message})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


User = get_user_model()


class ProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
    

class ProfileView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = []  # No authentication required

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        try:
            return Profile.objects.get(user__id=user_id)
        except Profile.DoesNotExist:
            raise NotFound("Profile not found")

class ProfileUpdateView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user.profile


from rest_framework import generics, permissions
from .models import Post
from .serializers import PostSerializer

class UserPostsListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        slug = self.kwargs.get('slug')
        return get_object_or_404(queryset, slug=slug)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class UserPostEditView(generics.UpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        slug = self.kwargs.get('slug')
        return get_object_or_404(queryset, slug=slug)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

import json
from django.http import JsonResponse

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def comment_list_create(request):
    if request.method == 'GET':
        post_id = request.query_params.get('post_id')
        if post_id:
            comments = Comment.objects.filter(post_id=post_id)
            serializer = CommentSerializer(comments, many=True)
            return JsonResponse(serializer.data, safe=False)
        return JsonResponse({"message": "post_id parameter is required"}, status=400)
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            post_id = data.get('post')
            comment_text = data.get('comment')
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON"}, status=400)

        print(f"Received POST data: post_id={post_id}, comment={comment_text}")

        if not post_id or not comment_text:
            return JsonResponse({"message": "post_id and comment are required"}, status=400)
        
        post = get_object_or_404(Post, pk=post_id)
        comment = Comment.objects.create(user=request.user, post=post, comment=comment_text)
        serializer = CommentSerializer(comment)
        return JsonResponse(serializer.data, status=201)
    
class CommentListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        if post_id:
            return Comment.objects.filter(post_id=post_id)
        return Comment.objects.none()

class UserPostCommentListAPIView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            post_ids = Post.objects.filter(user_id=user_id).values_list('id', flat=True)
            return Comment.objects.filter(post_id__in=post_ids, parent_comment=None)
        return Comment.objects.none()
    
class ReplyToCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        parent_comment_id = request.data.get('parent_comment')
        comment_text = request.data.get('comment')
        post_id = request.data.get('post')

        if not post_id or not comment_text or not parent_comment_id:
            return Response({'detail': 'Post, comment, and parent comment are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parent_comment = Comment.objects.get(id=parent_comment_id)
            post = Post.objects.get(id=post_id)
        except Comment.DoesNotExist:
            return Response({'detail': 'Parent comment not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_comment = Comment(
            post=post,
            name=request.user.username,
            user=request.user,
            email=request.user.email,
            comment=comment_text,
            parent_comment=parent_comment
        )
        new_comment.save()
        return Response(CommentSerializer(new_comment).data, status=status.HTTP_201_CREATED)
    
class BookmarkedPostsListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        bookmarks = Bookmark.objects.filter(user=request.user).select_related('post')
        serialized_posts = PostSerializer([bookmark.post for bookmark in bookmarks], many=True)
        return Response(serialized_posts.data)
    
class RecentPostsListView(generics.ListAPIView):
    queryset = Post.objects.all().order_by('-date')[:4]  # Order by most recent
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

class FeaturedPostsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        featured_posts = Post.objects.filter(is_featured=True)[:1]  
        serializer = FeaturedPostSerializer(featured_posts, many=True)
        return Response(serializer.data)
    
class PopularPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = []

    def get_queryset(self):
        # Return the posts ordered by views and then by likes_count, descending order
        return Post.objects.order_by('-views', '-likes')[:10]
    
class TrendingPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = []

    def get_queryset(self):
        timeframe = timezone.now() - timedelta(days=7)
        
        queryset = Post.objects.filter(date__gte=timeframe).annotate(
            recent_views_count=Count(
                Subquery(
                    View.objects.filter(
                        post=OuterRef('pk'), viewed_at__gte=timeframe
                    ).values('post')
                )
            ),
            recent_likes_count=Count(
                Subquery(
                    Like.objects.filter(
                        post=OuterRef('pk'), created_at__gte=timeframe
                    ).values('post')
                )
            ),
            recent_comments_count=Count(
                Subquery(
                    Comment.objects.filter(
                        post=OuterRef('pk'), date__gte=timeframe
                    ).values('post')
                )
            )
        ).order_by('-recent_views_count', '-recent_likes_count', '-recent_comments_count')[:10]
        
        return queryset
    
# class TagListView(generics.ListAPIView):
#     queryset = Tag.objects.all()
#     serializer_class = TagSerializer
#     permission_classes = []

# class PostsByTagIdView(generics.ListAPIView):
#     serializer_class = PostSerializer
#     permission_classes = []

#     def get_queryset(self):
#         tag_id = self.kwargs['id']
#         return Post.objects.filter(tags__id=tag_id)

import logging

logger = logging.getLogger(__name__)

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = Post.objects.all()
        search_query = self.request.query_params.get('search', None)
        print(search_query)  # This should print the search query if the method is called

        if search_query:
            queryset = queryset.filter(title__icontains=search_query)
            print(queryset.query)  # This should print the SQL query being executed

        if not queryset.exists():
            raise generics.NotFound("No Post matches the given query.")

        return queryset

class PostSearchView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = []  # Allow all users to access

    def get_queryset(self):
        queryset = Post.objects.all()
        search_query = self.request.query_params.get('search', None)
        category_query = self.request.query_params.get('category', None)
        if search_query:
            queryset = queryset.filter(title__icontains=search_query)
        if category_query:
            queryset = queryset.filter(category__title__icontains=category_query)
        return queryset
    
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

@csrf_exempt
@require_http_methods(["GET"])
@api_view(['GET'])
@permission_classes([AllowAny])
def all_posts_view(request):
    try:
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)  # Allow all users to access
    