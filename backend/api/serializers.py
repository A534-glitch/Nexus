
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import StudentProfile, Product, Comment

class UserSerializer(serializers.ModelSerializer):
    college = serializers.CharField(source='profile.college', read_only=True)
    avatar = serializers.CharField(source='profile.avatar', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'college', 'avatar']

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'user_name', 'text', 'timestamp']

class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.first_name', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'
