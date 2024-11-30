#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
check_requirements() {
    print_message "$YELLOW" "Checking requirements..."
    
    local requirements=("docker" "docker-compose")
    local missing=()

    for cmd in "${requirements[@]}"; do
        if ! command_exists "$cmd"; then
            missing+=("$cmd")
        fi
    done

    if [ ${#missing[@]} -ne 0 ]; then
        print_message "$RED" "Error: Missing required tools: ${missing[*]}"
        exit 1
    fi

    print_message "$GREEN" "All requirements satisfied"
}

# Build and push Docker images
build_images() {
    print_message "$YELLOW" "Building Docker images..."
    
    docker-compose build --parallel || {
        print_message "$RED" "Error: Failed to build Docker images"
        exit 1
    }
    
    print_message "$GREEN" "Successfully built Docker images"
}

# Deploy services
deploy_services() {
    print_message "$YELLOW" "Deploying services..."
    
    # Pull latest images
    docker-compose pull
    
    # Deploy stack
    docker-compose up -d --remove-orphans || {
        print_message "$RED" "Error: Failed to deploy services"
        exit 1
    }
    
    print_message "$GREEN" "Successfully deployed services"
}

# Scale services
scale_services() {
    print_message "$YELLOW" "Scaling services..."
    
    # Scale web service
    docker-compose up -d --scale web=3 --scale nginx=2 || {
        print_message "$RED" "Error: Failed to scale services"
        exit 1
    }
    
    print_message "$GREEN" "Successfully scaled services"
}

# Monitor deployment
monitor_deployment() {
    print_message "$YELLOW" "Monitoring deployment..."
    
    # Check service health
    local services=("web" "mongodb" "nginx" "redis")
    local unhealthy=()

    for service in "${services[@]}"; do
        if ! docker-compose ps "$service" | grep -q "Up"; then
            unhealthy+=("$service")
        fi
    done

    if [ ${#unhealthy[@]} -ne 0 ]; then
        print_message "$RED" "Error: Unhealthy services: ${unhealthy[*]}"
        docker-compose logs "${unhealthy[@]}"
        exit 1
    fi

    print_message "$GREEN" "All services are healthy"
}

# Cleanup old resources
cleanup() {
    print_message "$YELLOW" "Cleaning up old resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    print_message "$GREEN" "Cleanup completed"
}

# Main deployment function
main() {
    local command=$1
    
    case $command in
        "deploy")
            check_requirements
            build_images
            deploy_services
            scale_services
            monitor_deployment
            ;;
        "scale")
            check_requirements
            scale_services
            monitor_deployment
            ;;
        "cleanup")
            check_requirements
            cleanup
            ;;
        "logs")
            docker-compose logs -f
            ;;
        "status")
            docker-compose ps
            ;;
        *)
            print_message "$YELLOW" "Usage: $0 {deploy|scale|cleanup|logs|status}"
            exit 1
            ;;
    esac
}

# Execute main function with provided arguments
main "$@"
