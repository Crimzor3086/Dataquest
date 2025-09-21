#!/bin/bash

# DataQuest Solutions - Deployment Status Check Script

echo "🔍 Checking DataQuest Solutions Backend Deployment Status..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if Supabase CLI is available
if npx supabase --version > /dev/null 2>&1; then
    print_success "Supabase CLI is installed"
else
    print_error "Supabase CLI not found"
    exit 1
fi

# Check project link status
print_status "Checking project link status..."
if npx supabase status > /dev/null 2>&1; then
    print_success "Project is linked to Supabase"
    
    # Show project info
    echo ""
    print_status "Project Information:"
    npx supabase status
else
    print_warning "Project not linked. Run: npx supabase link --project-ref jceggjtlmvaocivekhba"
fi

echo ""
print_status "Checking Edge Functions..."

# List available functions
if npx supabase functions list > /dev/null 2>&1; then
    print_success "Edge Functions are accessible"
    echo ""
    print_status "Available Functions:"
    npx supabase functions list
else
    print_warning "Cannot access Edge Functions. May need to deploy first."
fi

echo ""
print_status "Checking Storage Buckets..."

# List storage buckets
if npx supabase storage list > /dev/null 2>&1; then
    print_success "Storage is accessible"
    echo ""
    print_status "Available Buckets:"
    npx supabase storage list
else
    print_warning "Cannot access Storage. May need to create buckets first."
fi

echo ""
print_status "Checking Database Connection..."

# Test database connection
if npx supabase db ping > /dev/null 2>&1; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
fi

echo ""
echo "=================================================="
print_status "Deployment Status Check Complete"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Run './deploy.sh' to deploy the backend"
echo "2. Set up environment variables in Supabase Dashboard"
echo "3. Configure OAuth providers"
echo "4. Test all functions"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
