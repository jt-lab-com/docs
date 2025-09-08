#!/bin/bash

# Скрипт для быстрого деплоя документации

echo "🚀 Начинаем деплой документации JT-Lab..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Убедитесь, что вы находитесь в корне проекта."
    exit 1
fi

# Проверяем, что git настроен
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: Это не git репозиторий."
    exit 1
fi

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm ci

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Проверяем, что сборка прошла успешно
if [ ! -d "build" ]; then
    echo "❌ Ошибка: Сборка не удалась. Папка build не создана."
    exit 1
fi

# Добавляем все изменения в git
echo "📝 Добавляем изменения в git..."
git add .

# Делаем commit
echo "💾 Создаем commit..."
git commit -m "Deploy: Update documentation $(date '+%Y-%m-%d %H:%M:%S')"

# Пушим в main ветку
echo "🚀 Отправляем изменения на GitHub..."
git push origin main

echo "✅ Деплой завершен! GitHub Actions автоматически развернет сайт."
echo "🌐 Сайт будет доступен по адресу: https://YOUR_USERNAME.github.io/jt-lab-docs-en/"
echo ""
echo "📊 Проверьте статус деплоя в разделе Actions на GitHub."
