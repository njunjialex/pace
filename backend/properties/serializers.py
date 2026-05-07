from rest_framework import serializers
from .models import Property, PropertyImage, VirtualTour, Amenity

# Serializer for Amenity model
class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()   # This ensures full URL

    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'is_main']

    def get_image(self, obj):
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"   # Full URL
        return None


class VirtualTourSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualTour
        fields = ['id', 'title', 'video_url']


class PropertySerializer(serializers.ModelSerializer):
    landlord = serializers.SerializerMethodField()
    images = PropertyImageSerializer(many=True, read_only=True)
    virtual_tours = VirtualTourSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'price', 'location',
            'property_type', 'bedrooms',
            'bathrooms', 'square_feet', 'furnished', 'pet_friendly',
            'available_from', 'status', 'created_at', 'landlord',
            'images', 'virtual_tours', 'amenities'
        ]
        read_only_fields = ['landlord', 'created_at']

    def get_landlord(self, obj):
        return {
            'id': obj.landlord.id,
            'first_name': obj.landlord.first_name,
            'last_name': obj.landlord.last_name,
            'username': obj.landlord.username,
        }


# Serializer used when creating a new property
class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'title', 'description', 'price', 'location',
            'property_type', 'bedrooms', 'bathrooms', 'square_feet',
            'furnished', 'pet_friendly', 'available_from', 'amenities'
        ]