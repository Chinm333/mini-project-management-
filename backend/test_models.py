#!/usr/bin/env python
"""
Test script for Django models.
This script tests the creation and relationships of all models.
"""

import os
import sys
import django
from pathlib import Path
from datetime import datetime, timedelta

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

def setup_django():
    """Initialize Django settings."""
    try:
        django.setup()
        print("✅ Django initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to initialize Django: {e}")
        return False

def test_models():
    """Test all models by creating sample data."""
    try:
        from organizations.models import Organization
        from projects.models import Project
        from tasks.models import Task, TaskComment
        
        print("\n🧪 Testing Models...")
        print("=" * 30)
        
        # Test Organization creation
        print("Creating test organization...")
        org = Organization.objects.create(
            name="Test Company Inc.",
            contact_email="test@company.com"
        )
        print(f"✅ Created organization: {org.name} (slug: {org.slug})")
        
        # Test Project creation
        print("Creating test project...")
        project = Project.objects.create(
            organization=org,
            name="Website Redesign",
            description="Redesign the company website with modern UI/UX",
            status="ACTIVE",
            due_date=datetime.now().date() + timedelta(days=30)
        )
        print(f"✅ Created project: {project.name}")
        print(f"   - Task count: {project.task_count}")
        print(f"   - Completion rate: {project.completion_rate}%")
        
        # Test Task creation
        print("Creating test tasks...")
        task1 = Task.objects.create(
            project=project,
            title="Design Homepage",
            description="Create wireframes and mockups for the homepage",
            status="IN_PROGRESS",
            assignee_email="designer@company.com",
            due_date=datetime.now() + timedelta(days=7)
        )
        
        task2 = Task.objects.create(
            project=project,
            title="Implement Navigation",
            description="Code the main navigation component",
            status="TODO",
            assignee_email="developer@company.com",
            due_date=datetime.now() + timedelta(days=14)
        )
        
        print(f"✅ Created tasks: {task1.title}, {task2.title}")
        print(f"   - Project task count: {project.task_count}")
        print(f"   - Project completion rate: {project.completion_rate}%")
        
        # Test TaskComment creation
        print("Creating test comment...")
        comment = TaskComment.objects.create(
            task=task1,
            content="Started working on the homepage design. Will have mockups ready by Friday.",
            author_email="designer@company.com"
        )
        print(f"✅ Created comment: {comment.content[:50]}...")
        print(f"   - Task comment count: {task1.comment_count}")
        
        # Test relationships
        print("\n🔗 Testing Relationships...")
        print(f"Organization '{org.name}' has {org.project_count} projects")
        print(f"Project '{project.name}' has {project.task_count} tasks")
        print(f"Task '{task1.title}' has {task1.comment_count} comments")
        print(f"Task '{task1.title}' belongs to organization: {task1.organization.name}")
        
        # Test statistics
        print("\n📊 Testing Statistics...")
        print(f"Organization active projects: {org.active_project_count}")
        print(f"Project completion rate: {project.completion_rate}%")
        print(f"Task overdue status: {task1.is_overdue}")
        
        print("\n✅ All model tests passed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Model test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def cleanup_test_data():
    """Clean up test data."""
    try:
        from organizations.models import Organization
        
        # Delete test organization (this will cascade delete projects, tasks, comments)
        Organization.objects.filter(name="Test Company Inc.").delete()
        print("🧹 Cleaned up test data")
        return True
    except Exception as e:
        print(f"❌ Failed to cleanup test data: {e}")
        return False

def main():
    """Main test function."""
    print("🧪 Testing Project Management System Models...")
    print("=" * 50)
    
    # Step 1: Initialize Django
    if not setup_django():
        return False
    
    # Step 2: Test models
    if not test_models():
        return False
    
    # Step 3: Cleanup
    cleanup_test_data()
    
    print("\n" + "=" * 50)
    print("🎉 All tests completed successfully!")
    print("\nYour Django models are working correctly!")
    
    return True

if __name__ == '__main__':
    main()

