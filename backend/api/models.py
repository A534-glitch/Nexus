
from django.db import models
from django.contrib.auth.models import User

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    college = models.CharField(max_length=255)
    avatar = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    upi_id = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.college}"

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Notebook', 'Notebook'),
        ('Gadget', 'Gadget'),
        ('Stationery', 'Stationery'),
        ('Other', 'Other'),
    ]
    CONDITION_CHOICES = [
        ('Brand New', 'Brand New'),
        ('Like New', 'Like New'),
        ('Good', 'Good'),
        ('Fair', 'Fair'),
    ]

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rent_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    can_rent = models.BooleanField(default=False)
    image = models.TextField() # Base64 or URL
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    
    # Specs stored as JSON for flexible gadget attributes
    specs = models.JSONField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
