# Generated by Django 5.0.6 on 2024-07-13 16:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Blogcore', '0019_tag_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tag',
            name='name',
        ),
        migrations.AddField(
            model_name='tag',
            name='title',
            field=models.CharField(default=12, max_length=100),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='post',
            name='tags',
        ),
        migrations.AddField(
            model_name='post',
            name='tags',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='posts', to='Blogcore.tag'),
        ),
    ]