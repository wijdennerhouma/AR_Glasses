from django.db import models

class GlassesModel(models.Model):
    json_data = models.JSONField()
    sku = models.CharField(max_length=100, default="Unknown")

    class Meta:
        db_table = 'MyApp_AR_glassesmodel'
