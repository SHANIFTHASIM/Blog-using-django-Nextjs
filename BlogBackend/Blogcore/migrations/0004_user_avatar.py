# Generated by Django 5.0.6 on 2024-07-04 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Blogcore', '0003_post_profile_post_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.FileField(blank=True, default='default/default-user.jpg', null=True, upload_to='image'),
        ),
    ]
