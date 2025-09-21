#!/bin/bash

# DataQuest Solutions - Backend Deployment Script
# This script automates the deployment of Supabase backend components

set -e  # Exit on any error

echo "🚀 Starting DataQuest Solutions Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is available
check_supabase_cli() {
    print_status "Checking Supabase CLI..."
    if ! npx supabase --version > /dev/null 2>&1; then
        print_error "Supabase CLI not found. Installing..."
        npm install supabase --save-dev
    fi
    print_success "Supabase CLI is available"
}

# Check if project is linked
check_project_link() {
    print_status "Checking project link..."
    if ! npx supabase status > /dev/null 2>&1; then
        print_warning "Project not linked. Please run: npx supabase link --project-ref jceggjtlmvaocivekhba"
        print_status "You'll need your database password to complete the linking process."
        exit 1
    fi
    print_success "Project is linked"
}

# Deploy database migrations
deploy_database() {
    print_status "Deploying database schema..."
    if npx supabase db push; then
        print_success "Database schema deployed successfully"
    else
        print_error "Database deployment failed"
        exit 1
    fi
}

# Deploy Edge Functions
deploy_functions() {
    print_status "Deploying Edge Functions..."
    
    # List of functions to deploy
    functions=(
        "send-email"
        "send-contact-email"
        "send-webinar-registration"
        "mpesa-status"
    )
    
    for func in "${functions[@]}"; do
        print_status "Deploying function: $func"
        if npx supabase functions deploy "$func"; then
            print_success "Function $func deployed successfully"
        else
            print_error "Failed to deploy function $func"
            exit 1
        fi
    done
    
    print_success "All Edge Functions deployed successfully"
}

# Set up storage buckets
setup_storage() {
    print_status "Setting up storage buckets..."
    
    # Create avatars bucket
    if npx supabase storage create avatars --public 2>/dev/null; then
        print_success "Avatars bucket created"
    else
        print_warning "Avatars bucket may already exist"
    fi
    
    # Create documents bucket
    if npx supabase storage create documents --public 2>/dev/null; then
        print_success "Documents bucket created"
    else
        print_warning "Documents bucket may already exist"
    fi
    
    # Create course-materials bucket
    if npx supabase storage create course-materials --public 2>/dev/null; then
        print_success "Course materials bucket created"
    else
        print_warning "Course materials bucket may already exist"
    fi
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test database connection
    if npx supabase db ping > /dev/null 2>&1; then
        print_success "Database connection successful"
    else
        print_error "Database connection failed"
        exit 1
    fi
    
    # List deployed functions
    print_status "Deployed Edge Functions:"
    npx supabase functions list
    
    # List storage buckets
    print_status "Storage buckets:"
    npx supabase storage list
}

# Main deployment process
main() {
    echo "=========================================="
    echo "  DataQuest Solutions Backend Deployment"
    echo "=========================================="
    echo ""
    
    check_supabase_cli
    check_project_link
    deploy_database
    deploy_functions
    setup_storage
    test_deployment
    
    echo ""
    echo "=========================================="
    print_success "🎉 Backend deployment completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Set up environment variables in Supabase Dashboard"
    echo "2. Configure OAuth providers (Google, GitHub)"
    echo "3. Set up storage policies"
    echo "4. Test all Edge Functions"
    echo ""
    echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
}

# Run main function
main "$@"
