from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'organization', 'status', 'due_date', 
        'task_count', 'completion_rate', 'is_overdue', 'created_at'
    ]
    list_filter = ['status', 'organization', 'created_at', 'due_date']
    search_fields = ['name', 'description', 'organization__name']
    list_select_related = ['organization']
    readonly_fields = ['created_at', 'updated_at', 'task_count', 'completion_rate']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('organization', 'name', 'description')
        }),
        ('Status & Timeline', {
            'fields': ('status', 'due_date')
        }),
        ('Statistics', {
            'fields': ('task_count', 'completion_rate'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

