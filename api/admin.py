from django.contrib import admin
from django.utils.html import format_html
from .models import About, Project, ProjectImage, Client


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ('image', 'image_preview', 'caption', 'order')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:80px;border-radius:4px;" />',
                obj.image.url
            )
        return "—"
    image_preview.short_description = "Vista previa"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'client_name', 'order', 'main_image_preview', 'has_link', 'created_at')
    list_editable = ('order', 'category', 'status')
    list_filter = ('category', 'status', 'client_name')
    search_fields = ('title', 'description', 'client_name')
    inlines = [ProjectImageInline]
    ordering = ('order', '-created_at')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Información Principal', {
            'fields': (
                'title', 'category', 'status', 'client_name', 
                'summary', 'description', 'results', 'order'
            )
        }),
        ("Multimedia", {
            "fields": ("main_image", "preview_link"),
        }),
    )

    def main_image_preview(self, obj):
        if obj.main_image:
            return format_html(
                '<img src="{}" style="height:50px;border-radius:4px;" />',
                obj.main_image.url
            )
        return "—"
    main_image_preview.short_description = "Imagen"

    def has_link(self, obj):
        if obj.preview_link:
            return format_html('<a href="{}" target="_blank">🔗 Ver</a>', obj.preview_link)
        return "—"
    has_link.short_description = "Link"


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'industry', 'logo_preview')
    search_fields = ('name',)

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="height:40px;border-radius:20px;" />', obj.logo.url)
        return "—"
    logo_preview.short_description = "Logo"


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ('title',)
