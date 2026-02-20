from django.db import models

class AccountMapping(models.Model):
    account = models.BigIntegerField(unique=True)
    payment_method = models.CharField(max_length=255, blank=True, null=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    tags = models.JSONField(blank=True, default=list)  # JSON field for tags (list of strings)
    sum_of = models.CharField(max_length=255, blank=True, null=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children'
    )  # Self-referential ForeignKey for parent-child relationship
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        parent_str = f" (Parent: {self.parent.account})" if self.parent else ""
        return f"{self.full_name or 'AccountMapping #' + str(self.id)}{parent_str}"

    @property
    def mapping_count(self):
        return self.children.count()  # Counts child AccountMappings

    class Meta:
        db_table = 'account_mappings'  # Maps to MongoDB collection