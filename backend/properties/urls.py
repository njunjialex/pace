# backend/properties/urls.py
from django.urls import path
from .views import PropertyListCreateView, PropertyDetailView, PropertyCreateView, LandlordDashboardStatsView, AmenityListView

urlpatterns = [
    path('', PropertyListCreateView.as_view(), name='property-list'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    path('create/', PropertyCreateView.as_view(), name='property-create'),
    path('dashboard-stats/', LandlordDashboardStatsView.as_view(), name='landlord-dashboard-stats'),
    path('amenities/', AmenityListView.as_view(), name='amenities' )
    ]
