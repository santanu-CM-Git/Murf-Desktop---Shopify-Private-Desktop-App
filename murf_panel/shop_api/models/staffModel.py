from django.db import models
from .departmentModel import Department

class StaffMember(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='staff_members')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
