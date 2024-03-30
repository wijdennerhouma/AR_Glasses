from django.shortcuts import render

def app(request):
    # Votre logique pour la vue app
    return render(request,'integration_vto/index.html')
