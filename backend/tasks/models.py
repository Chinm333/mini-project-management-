from django.db import models
from projects.models import Project


class Task(models.Model):
    """
    Task model that belongs to a project.
    """
    TASK_STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('REVIEW', 'Review'),
        ('DONE', 'Done'),
    ]

    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='tasks'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, 
        choices=TASK_STATUS_CHOICES, 
        default='TODO'
    )
    assignee_email = models.EmailField(blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['project', 'title']

    def __str__(self):
        return f"{self.title} - {self.project.name}"

    @property
    def organization(self):
        """Return the organization this task belongs to."""
        return self.project.organization

    @property
    def comment_count(self):
        """Return the number of comments on this task."""
        return self.comments.count()

    @property
    def is_overdue(self):
        """Check if the task is overdue."""
        if self.due_date:
            from django.utils import timezone
            return timezone.now() > self.due_date
        return False


class TaskComment(models.Model):
    """
    Comment model for tasks.
    """
    task = models.ForeignKey(
        Task, 
        on_delete=models.CASCADE, 
        related_name='comments'
    )
    content = models.TextField()
    author_email = models.EmailField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Comment by {self.author_email} on {self.task.title}"

    @property
    def organization(self):
        """Return the organization this comment belongs to."""
        return self.task.organization

