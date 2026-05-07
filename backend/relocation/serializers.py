from rest_framework import serializers
from .models import MoveRequest, MoveQuote

class MoveRequestSerializer(serializers.ModelSerializer):
    tenant = serializers.PrimaryKeyRelatedField(read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model = MoveRequest
        fields = ['id', 'tenant', 'property', 'property_title', 'preferred_date', 'status', 'created_at']

class MoveQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoveQuote
        fields = ['id', 'move_request', 'relocator', 'price', 'description', 'is_accepted', 'created_at']