from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics
from .models import GlassesModel
from .serializers import GlassesModelSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

def app(request):
    # Logique de la vue app
    return render(request, 'integration_vto/index.html')

@api_view(['GET'])
def getAllGlasses(request):
    glasses = GlassesModel.objects.all()
    serializer = GlassesModelSerializer(glasses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def getGlassesBySKU(request, sku):
    try:
        glasses_model = GlassesModel.objects.get(sku=sku)
        serializer = GlassesModelSerializer(glasses_model)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except GlassesModel.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
