from django.db import models
from organizations.models import Organization


class Project(models.Model):
    """
    Project model that belongs to an organization.
    """
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
        ('CANCELLED', 'Cancelled'),
    ]

    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        related_name='projects'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='ACTIVE'
    )
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['organization', 'name']

    def __str__(self):
        return f"{self.name} - {self.organization.name}"

    @property
    def task_count(self):
        """Return the number of tasks in this project."""
        return self.tasks.count()

    @property
    def completed_task_count(self):
        """Return the number of completed tasks in this project."""
        return self.tasks.filter(status='DONE').count()

    @property
    def completion_rate(self):
        """Return the completion rate as a percentage."""
        if self.task_count == 0:
            return 0
        return round((self.completed_task_count / self.task_count) * 100, 1)

    @property
    def is_overdue(self):
        """Check if the project is overdue."""
        if self.due_date:
            from django.utils import timezone
            return timezone.now().date() > self.due_date
        return False

