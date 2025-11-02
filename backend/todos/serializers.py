from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo 
        fields = '__all__'
    
    def validate_title(self, value):
        """
        Validate that title is not empty or only whitespace
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty or contain only whitespace.")
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        if len(value) > 200:
            raise serializers.ValidationError("Title cannot exceed 200 characters.")
        return value.strip()
    
    def validate_description(self, value):
        """
        Validate description length
        """
        if value and len(value) > 1000:
            raise serializers.ValidationError("Description cannot exceed 1000 characters.")
        return value
    
    def validate_status(self, value):
        """
        Validate that status is one of the allowed choices
        """
        allowed_statuses = ['open', 'in_progress', 'done']
        if value not in allowed_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(allowed_statuses)}"
            )
        return value
