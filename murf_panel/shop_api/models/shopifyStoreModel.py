from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class ShopifyStore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stores')
    store_url = models.CharField(max_length=200, unique=True)
    admin_api_key = models.CharField(max_length=100)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.store_url} ({self.user.username})"

@receiver(post_save, sender=ShopifyStore)
def ensure_single_primary(sender, instance, **kwargs):
    """Ensure only one store per user is primary."""
    if instance.is_primary:
        ShopifyStore.objects.filter(user=instance.user).exclude(id=instance.id).update(is_primary=False)
