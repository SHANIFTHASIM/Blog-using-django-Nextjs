# Generated by Django 5.0.6 on 2024-07-13 09:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Blogcore', '0017_alter_post_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
            options={
                'verbose_name_plural': 'Tags',
            },
        ),
        migrations.RemoveField(
            model_name='post',
            name='tags',
        ),
        migrations.AddField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='posts', to='Blogcore.tag'),
        ),
    ]
