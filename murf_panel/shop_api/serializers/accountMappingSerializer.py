from rest_framework import serializers
from shop_api.models.accountMappingModel import AccountMapping

class AccountMappingSerializer(serializers.ModelSerializer):
    mapping_count = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(
        queryset=AccountMapping.objects.all(),
        allow_null=True,
        required=False
    )  # For input (PUT/POST)
    parent_data = serializers.SerializerMethodField()  # For output (GET)

    class Meta:
        model = AccountMapping
        fields = ['id', 'account', 'payment_method', 'full_name', 'type', 'tags', 'created_at', 'updated_at', 'mapping_count', 'sum_of', 'parent', 'parent_data']

    def get_mapping_count(self, obj):
        return obj.children.count()

    def get_parent_data(self, obj):
        if obj.parent:
            return AccountMappingSerializer(
                obj.parent,
                context=self.context,
                fields=['id', 'account', 'full_name', 'parent_data']  # Use parent_data for nested parents
            ).data
        return None

    def validate_parent(self, value):
        if self.instance and value and value.id == self.instance.id:
            raise serializers.ValidationError("An account cannot be its own parent")
        return value

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)
        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)