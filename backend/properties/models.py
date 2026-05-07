# backend/properties/models.py
from django.db import models
from users.models import User

class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Property(models.Model):
    CATEGORY_CHOICES = (
        ('residential', 'Residential'),
        ('business', 'Business / Commercial'),
    )

    RESIDENTIAL_TYPES = (
        ('bedsitter', 'Bedsitter'),
        ('studio', 'Studio'),
        ('1_bedroom', '1 Bedroom'),
        ('2_bedroom', '2 Bedroom'),
        ('3_bedroom', '3 Bedroom'),
        ('4_bedroom', '4+ Bedroom'),
        ('house', 'Standalone House'),
    )

    BUSINESS_TYPES = (
        ('godown', 'Godown'),
        ('warehouse', 'Warehouse'),
        ('shop', 'Shop / Retail Space'),
        ('office', 'Office Space'),
        ('mall', 'Mall / Shopping Complex'),
        ('showroom', 'Showroom'),
        ('other_commercial', 'Other Commercial'),
    )

    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='residential')
    property_type = models.CharField(max_length=30)  # Will store the sub-type

    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    location = models.CharField(max_length=300)
    
    bedrooms = models.PositiveIntegerField(null=True, blank=True)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)
    square_feet = models.PositiveIntegerField(null=True, blank=True)
    
    furnished = models.BooleanField(default=False)
    pet_friendly = models.BooleanField(default=False)
    available_from = models.DateField()
    
    status = models.CharField(max_length=20, default='available')
    created_at = models.DateTimeField(auto_now_add=True)

    amenities = models.ManyToManyField(Amenity, blank=True)

    def __str__(self):
        return self.title

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/')
    is_main = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.title}"


class VirtualTour(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='virtual_tours')
    title = models.CharField(max_length=100)
    video_url = models.URLField()  # YouTube, Vimeo, Matterport, etc.
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title