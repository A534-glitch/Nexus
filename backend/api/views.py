
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, StudentProfile
from .serializers import ProductSerializer, UserSerializer
from django.contrib.auth.models import User

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        # In a real app, use self.request.user. 
        # For this demo, we'll assign to the first available user.
        serializer.save(seller=User.objects.first())

class AuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        # Simplified auth logic for the prototype
        user = User.objects.filter(username=username).first()
        if user:
            return Response(UserSerializer(user).data)
        return Response({'error': 'Node not found'}, status=status.HTTP_404_NOT_FOUND)
