from rest_framework import serializers
from shop_api.models import SourceNameMapping

class SourceNameMappingSerializer(serializers.ModelSerializer):
    # Explicitly define the id field as a CharField to handle ObjectId
    # id = serializers.CharField(source='pk', read_only=True)

    class Meta:
        model = SourceNameMapping
        fields = ['id', 'display_name', 'key']