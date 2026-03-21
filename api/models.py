from django.db import models


class About(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.title


class Project(models.Model):
    CATEGORY_CHOICES = [
        ('Aplicaciones Web', 'Aplicaciones Web'),
        ('Análisis de Negocios', 'Análisis de Negocios'),
        ('Inteligencia Artificial', 'Inteligencia Artificial'),
        ('Automatización', 'Automatización'),
        ('Robótica', 'Robótica'),
        ('Desarrollo de Videojuegos', 'Desarrollo de Videojuegos'),
    ]
    STATUS_CHOICES = [
        ('Culminado', 'Culminado'),
        ('En progreso', 'En progreso'),
        ('Abandonado', 'Abandonado'),
    ]
    title = models.CharField(max_length=200, verbose_name="Título")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Aplicaciones Web', verbose_name="Categoría")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Culminado', verbose_name="Estado")
    summary = models.CharField(max_length=400, blank=True, verbose_name="Resumen (tarjeta)")
    description = models.TextField(blank=True, verbose_name="Descripción completa")
    client_name = models.CharField(max_length=200, blank=True, verbose_name="Cliente")
    results = models.TextField(blank=True, verbose_name="Resultados / Impacto")
    preview_link = models.URLField(blank=True, null=True, verbose_name="Link al proyecto")
    main_image = models.ImageField(
        upload_to="projects/main/",
        blank=True,
        null=True,
        verbose_name="Imagen principal",
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Orden de aparición")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Proyecto"
        verbose_name_plural = "Proyectos"

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    """Imágenes auxiliares de un proyecto (galería)."""
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Proyecto",
    )
    image = models.ImageField(upload_to="projects/gallery/", verbose_name="Imagen")
    caption = models.CharField(max_length=200, blank=True, verbose_name="Pie de imagen")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Imagen auxiliar"
        verbose_name_plural = "Imágenes auxiliares"

    def __str__(self):
        return f"{self.project.title} — imagen {self.order}"


class Client(models.Model):
    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=200, blank=True, null=True)
    logo_url = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
