from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Post,Category,Like,Bookmark,Profile,Comment,Tag

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name']

class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'full_name', 'bio', 'about', 'author', 'country', 'facebook', 'twitter', 'date','image', 'email']

    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
        )
        return user



class TokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()



class PostSerializer(serializers.ModelSerializer):
    
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'slug', 'user', 'date', 'image', 'description','category','tags', 'views','status','is_featured', 'likes_count', 'is_liked', 'is_bookmarked')
        read_only_fields = ['user', 'view', 'likes', 'slug', 'date','tags']

    def get_likes_count(self, obj):
        return Like.objects.filter(post=obj).count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmark.filter(id=request.user.id).exists()
        return False  

class TagSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)
    
    class Meta:
        model = Tag
        fields = ('id', 'title', 'slug','posts')


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.ReadOnlyField()
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'title', 'image', 'slug', 'post_count','posts']



class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ('id', 'user', 'post', 'date')  # Specify fields you want to include

    def create(self, validated_data):
        return Bookmark.objects.create(**validated_data)
    
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Adjust this according to your UserSerializer
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'comment', 'date', 'parent_comment', 'replies']

    def get_replies(self, obj):
        # Prevent deep recursion by limiting the depth of replies
        max_depth = self.context.get('max_depth', 1)
        if max_depth > 0:
            replies = obj.replies.all()
            # Pass a decremented max_depth to avoid infinite recursion
            return CommentSerializer(replies, many=True, context={'max_depth': max_depth - 1}).data
        return []


class FeaturedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'image', 'date','slug']