from rest_framework import serializers
from shop_api.models.staffModel import StaffMember
from shop_api.models.departmentModel import Department

class DepartmentSerializer(serializers.ModelSerializer):
    staff_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = '__all__'  # or explicitly list fields, e.g. ['id', 'name', 'created_at', 'updated_at', 'staff_count']

    def get_staff_count(self, obj):
        return obj.staff_members.count()
