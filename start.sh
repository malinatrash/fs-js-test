#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting AmoCRM Integration Project...${NC}"

# Функция для проверки наличия node_modules
check_node_modules() {
    if [ ! -d "$1/node_modules" ]; then
        echo -e "${BLUE}Installing dependencies in $1...${NC}"
        cd $1 && npm install
        cd ..
    fi
}

# Установка зависимостей, если необходимо
check_node_modules "frontend"
check_node_modules "backend"

# Запуск бэкенда
echo -e "${GREEN}Starting backend server...${NC}"
cd backend
npm run start:dev &
BACKEND_PID=$!

# Ждем немного, чтобы бэкенд успел запуститься
sleep 2

# Запуск фронтенда
echo -e "${GREEN}Starting frontend server...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Функция для корректного завершения процессов
cleanup() {
    echo -e "${BLUE}\nShutting down servers...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Перехват сигнала завершения
trap cleanup SIGINT

# Ожидание завершения
wait
