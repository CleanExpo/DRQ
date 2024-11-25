#!/bin/bash

# Exit on error
set -e

# Configuration
DEPLOY_ENV="production"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
LOG_FILE="./deploy.log"
SLACK_WEBHOOK_URL="your_slack_webhook_url"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging function
log() {
    local message=$1
    local level=${2:-INFO}
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

# Slack notification function
notify_slack() {
    local message=$1
    local color=${2:-"good"}
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -s -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"${message}\",\"color\":\"${color}\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
}

# Backup function
create_backup() {
    log "Creating backup..." "INFO"
    mkdir -p "$BACKUP_DIR"
    
    # Backup source code
    tar -czf "$BACKUP_DIR/source.tar.gz" ./src
    
    # Backup environment files
    cp .env.production "$BACKUP_DIR/.env.production.backup"
    
    log "Backup created at $BACKUP_DIR" "SUCCESS"
}

# Health check function
check_health() {
    local url=$1
    local max_retries=5
    local count=0
    
    while [ $count -lt $max_retries ]; do
        if curl -s -f "$url" > /dev/null; then
            return 0
        fi
        count=$((count + 1))
        sleep 5
    done
    return 1
}

# Rollback function
rollback() {
    log "⚠️ Initiating rollback..." "WARNING"
    notify_slack "🔄 Rollback initiated for deployment" "danger"
    
    # Restore from backup
    if [ -d "$BACKUP_DIR" ]; then
        tar -xzf "$BACKUP_DIR/source.tar.gz" -C ./
        cp "$BACKUP_DIR/.env.production.backup" .env.production
        
        log "Rollback completed" "SUCCESS"
        notify_slack "✅ Rollback completed successfully" "good"
    else
        log "No backup found for rollback" "ERROR"
        notify_slack "❌ Rollback failed - no backup found" "danger"
        exit 1
    fi
}

# Main deployment script
main() {
    log "Starting deployment to ${DEPLOY_ENV}..." "INFO"
    notify_slack "🚀 Starting deployment to ${DEPLOY_ENV}"

    # Create backup
    create_backup

    # Run tests
    log "Running tests..." "INFO"
    if ! npm run test; then
        log "Tests failed" "ERROR"
        notify_slack "❌ Deployment failed - Tests failed" "danger"
        exit 1
    fi

    # Build application
    log "Building application..." "INFO"
    if ! npm run build; then
        log "Build failed" "ERROR"
        notify_slack "❌ Deployment failed - Build failed" "danger"
        exit 1
    fi

    # Run type check
    log "Running type check..." "INFO"
    if ! npm run type-check; then
        log "Type check failed" "ERROR"
        notify_slack "❌ Deployment failed - Type check failed" "danger"
        exit 1
    fi

    # Run linting
    log "Running linting..." "INFO"
    if ! npm run lint; then
        log "Linting failed" "ERROR"
        notify_slack "❌ Deployment failed - Linting failed" "danger"
        exit 1
    }

    # Deploy
    log "Deploying to ${DEPLOY_ENV}..." "INFO"
    if ! npm run deploy:${DEPLOY_ENV}; then
        log "Deployment failed" "ERROR"
        notify_slack "❌ Deployment failed" "danger"
        rollback
        exit 1
    fi

    # Health check
    log "Running health check..." "INFO"
    if ! check_health "https://disasterrecoveryqld.au/api/health"; then
        log "Health check failed" "ERROR"
        notify_slack "❌ Health check failed - Rolling back" "danger"
        rollback
        exit 1
    fi

    # Clear cache
    log "Clearing cache..." "INFO"
    if ! npm run clear-cache; then
        log "Cache clear failed" "WARNING"
        notify_slack "⚠️ Cache clear failed" "warning"
    fi

    log "Deployment completed successfully!" "SUCCESS"
    notify_slack "✅ Deployment completed successfully!"
}

# Trap errors
trap 'log "Error occurred. Exiting..." "ERROR"; notify_slack "❌ Deployment failed with error" "danger"; exit 1' ERR

# Execute main function
main "$@"
