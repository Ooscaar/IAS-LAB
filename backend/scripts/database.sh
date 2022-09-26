#!/bin/bash

# Exit on first failing command.
set -e

# Exit on unset variable.
set -u

# Echo commands.
set -x

if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found"
    exit
fi

docker-compose exec postgres bash -c "psql -U user -d db"