from django.db import models

class SourceNameMapping(models.Model):
    key = models.CharField(max_length=255, unique=True)  # no unique=True
    display_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key} → {self.display_name}"
    
    class Meta:
        db_table = 'source_mappings'
