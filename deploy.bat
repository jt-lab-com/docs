@echo off
echo 🚀 Начинаем деплой документации JT-Lab...

REM Проверяем, что мы в правильной директории
if not exist "package.json" (
    echo ❌ Ошибка: package.json не найден. Убедитесь, что вы находитесь в корне проекта.
    pause
    exit /b 1
)

REM Проверяем, что git настроен
if not exist ".git" (
    echo ❌ Ошибка: Это не git репозиторий.
    pause
    exit /b 1
)

REM Устанавливаем зависимости
echo 📦 Устанавливаем зависимости...
call npm ci

REM Собираем проект
echo 🔨 Собираем проект...
call npm run build

REM Проверяем, что сборка прошла успешно
if not exist "build" (
    echo ❌ Ошибка: Сборка не удалась. Папка build не создана.
    pause
    exit /b 1
)

REM Добавляем все изменения в git
echo 📝 Добавляем изменения в git...
git add .

REM Делаем commit
echo 💾 Создаем commit...
git commit -m "Deploy: Update documentation %date% %time%"

REM Пушим в main ветку
echo 🚀 Отправляем изменения на GitHub...
git push origin main

echo ✅ Деплой завершен! GitHub Actions автоматически развернет сайт.
echo 🌐 Сайт будет доступен по адресу: https://YOUR_USERNAME.github.io/jt-lab-docs-en/
echo.
echo 📊 Проверьте статус деплоя в разделе Actions на GitHub.
pause
