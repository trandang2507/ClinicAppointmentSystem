@echo off
echo Starting MediFlow Spring Boot Backend...
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run
pause
