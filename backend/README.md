# Backend

## Backup database

### Requirements
- age https://github.com/FiloSottile/age
- docker compose 
- ssh-keygen

### Create ssh key
Example with rsa key 2048 bits:
```bash
ssh-keygen -t rsa -b 2048 -C "<comment>"
```

### Run backup
```bash
❯ PUBLIC_KEY=/tmp/IAS-LAB/backend/test.pub ./docker-backup.sh
[*] Creating encrypted database backup
[*] Dumping database
[*] Compressing and encrypting dump
[*] Encrypted database backup created at /tmp/IAS-LAB/backend/backups/2022-11-19_18-23-47.age.gz
```
You can use a cron to run this script every day.