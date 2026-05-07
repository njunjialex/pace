from django.db import models
from users.models import User
from properties.models import Property

class MoveRequest(models.Model):
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='move_requests')
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    preferred_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('quoted', 'Quoted'),
        ('booked', 'Booked'),
        ('completed', 'Completed')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class MoveQuote(models.Model):
    move_request = models.ForeignKey(MoveRequest, on_delete=models.CASCADE, related_name='quotes')
    relocator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quotes_sent')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)