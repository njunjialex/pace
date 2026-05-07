from django.urls import path
from .views import MoveRequestCreateView

urlpatterns = [
    path('move-requests/', MoveRequestCreateView.as_view(), name='move-request'),
]