#!/usr/bin/env bash
# Backup script for encrypted backups

set -o pipefail
set -e

# Set the path to the backup directory
cd "$(dirname "$0")" || exit

# Docker container name
CONTAINER_NAME="postgres"

BACKUP_PATH="$(pwd)/backups"
BACKUP_FILE="$BACKUP_PATH/$(date +%Y-%m-%d_%H-%M-%S).age.gz"

# Database parameters
DB="db"
USER="user"

# Public key for the encryption
if [ ! -f "$PUBLIC_KEY" ]; then
    echo "Public key not found"
    exit 1
fi

# Check public key
if [ ! -f "$PUBLIC_KEY" ]; then
    echo "[error] Public key not found"
    exit 1
fi

# Create the backup directory if it doesn't exist
if [ ! -d "$BACKUP_PATH" ]; then
    mkdir "$BACKUP_PATH"
fi

# Check docker compose command
if ! command -v docker-compose &> /dev/null; then
    echo "[error] docker-compose could not be found"
    exit 1
fi

if ! command -v age &> /dev/null; then
    echo "[error] age could not be found"
    exit 1
fi

# Dump the database, compress it and encrypt it
echo "[*] Creating encrypted database backup"

echo "[*] Dumping database"
if ! out=$(docker-compose exec $CONTAINER_NAME bash -c "pg_dump -U $USER $DB"); then
    echo "[error] --> Failed to dump database, check docker configuration"
    exit 1
fi


echo "[*] Compressing and encrypting dump"
echo "$out" | gzip | age -R "$PUBLIC_KEY" > "$BACKUP_FILE" || echo "[error] --> Failed to create encrypted database backup"

echo "[*] Encrypted database backup created at $BACKUP_FILE"