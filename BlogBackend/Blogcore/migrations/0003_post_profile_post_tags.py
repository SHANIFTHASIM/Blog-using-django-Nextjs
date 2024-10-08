# Generated by Django 5.0.6 on 2024-07-03 17:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Blogcore', '0002_alter_post_options_remove_post_profile_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='profile',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Blogcore.profile'),
        ),
        migrations.AddField(
            model_name='post',
            name='tags',
            field=models.CharField(default=12, max_length=100),
            preserve_default=False,
        ),
    ]
