from django.db import models
from django.utils.text import slugify


class Organization(models.Model):
    """
    Organization model for multi-tenancy.
    Each organization is isolated from others.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    contact_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def project_count(self):
        """Return the number of projects in this organization."""
        return self.projects.count()

    @property
    def active_project_count(self):
        """Return the number of active projects in this organization."""
        return self.projects.filter(status='ACTIVE').count()

