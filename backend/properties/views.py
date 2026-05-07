# backend/properties/views.py
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property
from .models import Amenity
from .serializers import PropertySerializer, PropertyCreateSerializer

class PropertyListCreateView(generics.ListCreateAPIView):
    queryset = Property.objects.select_related('landlord').prefetch_related('images', 'amenities').order_by('-created_at')
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'bedrooms', 'furnished', 'pet_friendly', 'status']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'created_at']

    def get_serializer_class(self):
        # Use full serializer (with landlord info) for GET requests
        if self.request.method == 'GET':
            return PropertySerializer
        # Use create serializer for POST
        return PropertyCreateSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.select_related('landlord').prefetch_related('images', 'amenities')
    serializer_class = PropertySerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Property, PropertyImage
from .serializers import PropertyCreateSerializer, PropertySerializer, AmenitySerializer

class PropertyCreateView(generics.CreateAPIView):
    serializer_class = PropertyCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        property_obj = serializer.save(landlord=self.request.user)

        # Handle multiple image uploads
        images = self.request.FILES.getlist('images')
        for image in images:
            PropertyImage.objects.create(property=property_obj, image=image)

        return property_obj

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            property_obj = self.perform_create(serializer)
            response_serializer = PropertySerializer(property_obj)
            return Response({
                "message": "Property listed successfully!",
                "property": response_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# backend/properties/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count


class LandlordDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Only allow landlords
        if user.role != 'landlord':
            return Response({"error": "Access denied"}, status=403)

        total_properties = Property.objects.filter(landlord=user).count()
        available_properties = Property.objects.filter(landlord=user, status='available').count()
        
        # Pending applications (you can expand this later when you have Application model)
        pending_applications = 0  # Placeholder for now

        total_revenue = Property.objects.filter(
            landlord=user, 
            status='rented'
        ).aggregate(total=Sum('price'))['total'] or 0

        return Response({
            "total_properties": total_properties,
            "available_properties": available_properties,
            "pending_applications": pending_applications,
            "monthly_revenue": float(total_revenue),
        })

class AmenityListView(generics.ListAPIView):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]