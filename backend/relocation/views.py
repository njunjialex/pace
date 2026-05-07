from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import MoveRequest, MoveQuote
from .serializers import MoveRequestSerializer, MoveQuoteSerializer

class MoveRequestCreateView(generics.CreateAPIView):
    serializer_class = MoveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)