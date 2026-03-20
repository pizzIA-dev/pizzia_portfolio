from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutViewSet, ProjectViewSet, ClientViewSet

router = DefaultRouter()
router.register(r'about', AboutViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'clients', ClientViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
