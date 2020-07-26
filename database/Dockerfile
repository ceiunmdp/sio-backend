# Create mysql server based on the official image from the dockerhub
FROM mysql:8

# Optionnaly, run initial scripts for creating tables
COPY ./structure/ /docker-entrypoint-initdb.d/

# Start MySQL engine
CMD ["mysqld", "--character-set-server", "utf8mb4", "--collation-server", "utf8mb4_spanish_ci", "--default-authentication-plugin", "mysql_native_password"]
