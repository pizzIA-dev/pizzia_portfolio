import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import About, Project, Client

def populate():
    # About
    if not About.objects.exists():
        About.objects.create(
            title="PizzIA - IA para tu negocio",
            description="Somos una empresa de tecnología y análisis dedicada a transformar datos en decisiones estratégicas mediante Inteligencia Artificial y Machine Learning.",
            image_url="https://via.placeholder.com/800x400.png?text=PizzIA+Tech+y+Analisis"
        )
    
    # Projects
    if not Project.objects.exists():
        Project.objects.create(
            name="Predicción de Churn",
            client_name="Telecom Corp",
            description="Modelo de ML para predecir la fuga de clientes en telecomunicaciones.",
            results="Reducción del 15% en pérdida de clientes en 6 meses.",
            image_url="https://via.placeholder.com/400x300.png?text=Prediccion+Churn"
        )
        Project.objects.create(
            name="Optimización Logística",
            client_name="AgroSupply SA",
            description="Algoritmo heurístico para optimizar rutas de entrega de suministros agrícolas.",
            results="Ahorro del 20% en costos de combustible.",
            image_url="https://via.placeholder.com/400x300.png?text=Optimizacion+Logistica"
        )
        
    # Clients
    if not Client.objects.exists():
        Client.objects.create(
            name="Telecom Corp",
            industry="Telecomunicaciones",
            description="Proveedor líder de internet y telefonía.",
            logo_url="https://via.placeholder.com/150x150.png?text=Telecom"
        )
        Client.objects.create(
            name="AgroSupply SA",
            industry="Agricultura",
            description="Líder nacional en suministros agropecuarios.",
            logo_url="https://via.placeholder.com/150x150.png?text=AgroSupply"
        )
        Client.objects.create(
            name="Finanzas Plus",
            industry="Fintech",
            description="Créditos y microfinanzas con IA.",
            logo_url="https://via.placeholder.com/150x150.png?text=Finanzas+Plus"
        )
        
    print("Database populated successfully with PizzIA mock data!")

if __name__ == "__main__":
    populate()
