from rest_framework import serializers
from shop_api.models.staffModel import StaffMember
from shop_api.models.departmentModel import Department
from .departmentSerializer import DepartmentSerializer


class StaffMemberSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )

    class Meta:
        model = StaffMember
        fields = ['id', 'name', 'email', 'department', 'department_id', 'created_at', 'updated_at']
