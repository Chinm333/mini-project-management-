from django.contrib import admin
from .models import Task, TaskComment


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'project', 'status', 'assignee_email', 
        'due_date', 'comment_count', 'is_overdue', 'created_at'
    ]
    list_filter = ['status', 'project__organization', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'assignee_email', 'project__name']
    list_select_related = ['project', 'project__organization']
    readonly_fields = ['created_at', 'updated_at', 'comment_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('project', 'title', 'description')
        }),
        ('Assignment & Status', {
            'fields': ('status', 'assignee_email', 'due_date')
        }),
        ('Statistics', {
            'fields': ('comment_count',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'author_email', 'timestamp', 'organization']
    list_filter = ['timestamp', 'task__project__organization']
    search_fields = ['content', 'author_email', 'task__title']
    list_select_related = ['task', 'task__project', 'task__project__organization']
    readonly_fields = ['timestamp']
    
    fieldsets = (
        ('Comment Information', {
            'fields': ('task', 'content', 'author_email')
        }),
        ('Timestamps', {
            'fields': ('timestamp',),
            'classes': ('collapse',)
        }),
    )

