from rest_framework import serializers
from .models import GlassesModel

class GlassesModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlassesModel
        fields = '__all__'
