from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile, Category, Post, Comment, Bookmark, Like, Notification, View,Tag

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'username', 'full_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'full_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'country', 'author', 'date')
    search_fields = ('user__email', 'full_name', 'country')
    list_filter = ('author', 'country')
    ordering = ('user__email',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
    search_fields = ('title',)
    ordering = ('title',)


class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'category', 'view_count', 'date', 'total_likes', 'total_bookmarks')
    search_fields = ('title', 'user__email', 'category__title')
    list_filter = ('status', 'category')
    ordering = ('date',)
    prepopulated_fields = {'slug': ('title',)}

    def total_likes(self, obj):
        return obj.likes.count()
    total_likes.short_description = 'Likes'

    def total_bookmarks(self, obj):
        return obj.bookmark.count()
    total_bookmarks.short_description = 'Bookmarks'


class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'name', 'user', 'email', 'comment', 'parent_comment', 'date')
    list_filter = ('post', 'date')
    search_fields = ('name', 'email', 'comment', 'post__title')
    readonly_fields = ('date',)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('post', 'user', 'parent_comment')


class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'date')
    search_fields = ('post__title', 'user__email')
    ordering = ('date',)


class LikeAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'created_at')
    search_fields = ('post__title', 'user__email')
    ordering = ('created_at',)


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('type', 'user', 'post', 'seen', 'date')
    search_fields = ('type', 'user__email', 'post__title')
    list_filter = ('type', 'seen')
    ordering = ('date',)


admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Bookmark, BookmarkAdmin)
admin.site.register(Like, LikeAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(View)
admin.site.register(Tag)
