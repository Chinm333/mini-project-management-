#!/usr/bin/env python
"""
Setup script for the Project Management System backend.
This script helps with initial setup and database migrations.
"""

import os
import sys
import django
from pathlib import Path

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

def create_migrations():
    """Create database migrations for all apps."""
    try:
        from django.core.management import call_command
        call_command('makemigrations', 'organizations')
        call_command('makemigrations', 'projects')
        call_command('makemigrations', 'tasks')
        print("✅ Migrations created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create migrations: {e}")
        return False

def run_migrations():
    """Run database migrations."""
    try:
        from django.core.management import call_command
        call_command('migrate')
        print("✅ Migrations applied successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to run migrations: {e}")
        return False

def create_superuser():
    """Create a superuser account."""
    try:
        from django.core.management import call_command
        call_command('createsuperuser', interactive=False)
        print("✅ Superuser created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create superuser: {e}")
        return False

def main():
    """Main setup function."""
    print("🚀 Setting up Project Management System Backend...")
    print("=" * 50)
    
    # Step 1: Initialize Django
    if not setup_django():
        return False
    
    # Step 2: Create migrations
    if not create_migrations():
        return False
    
    # Step 3: Run migrations
    if not run_migrations():
        return False
    
    # Step 4: Create superuser (optional)
    print("\nWould you like to create a superuser? (y/n): ", end="")
    response = input().lower().strip()
    if response in ['y', 'yes']:
        create_superuser()
    
    print("\n" + "=" * 50)
    print("✅ Setup completed successfully!")
    print("\nNext steps:")
    print("1. Start the Django server: python manage.py runserver")
    print("2. Access the admin interface: http://localhost:8000/admin/")
    print("3. Access GraphQL endpoint: http://localhost:8000/graphql/")
    print("4. Start the frontend: cd ../frontend && npm start")
    
    return True

if __name__ == '__main__':
    main()

