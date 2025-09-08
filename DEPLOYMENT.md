# GitHub Actions Deployment Guide

## 🚀 Автоматический деплой на GitHub Pages

Этот репозиторий настроен для автоматического деплоя документации на GitHub Pages с помощью GitHub Actions.

### 📋 Что нужно сделать:

#### 1. **Включить GitHub Pages**
1. Перейдите в настройки репозитория: `Settings` → `Pages`
2. В разделе `Source` выберите `GitHub Actions`
3. Сохраните настройки

#### 2. **Настроить права доступа**
1. Перейдите в `Settings` → `Actions` → `General`
2. В разделе `Workflow permissions` выберите `Read and write permissions`
3. Поставьте галочку `Allow GitHub Actions to create and approve pull requests`
4. Сохраните настройки

#### 3. **Проверить настройки в docusaurus.config.ts**
```typescript
const config: Config = {
  url: 'https://YOUR_USERNAME.github.io',  // Замените на ваш GitHub username
  baseUrl: '/jt-lab-docs-en/',             // Имя репозитория
  // ... остальные настройки
};
```

#### 4. **Запустить деплой**
1. Сделайте commit и push в ветку `main`
2. GitHub Actions автоматически запустится
3. Проверьте статус в разделе `Actions`

### 🔧 Структура workflow

Файл `.github/workflows/deploy.yml` содержит:
- **Checkout** - получение кода
- **Setup Node.js** - настройка Node.js 18
- **Install dependencies** - установка зависимостей
- **Build website** - сборка сайта
- **Deploy to GitHub Pages** - деплой на GitHub Pages

### 📝 Команды для локальной разработки

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Сборка для продакшена
npm run build

# Локальный просмотр собранного сайта
npm run serve
```

### 🌐 Результат

После успешного деплоя ваша документация будет доступна по адресу:
`https://YOUR_USERNAME.github.io/jt-lab-docs-en/`

### 🐛 Устранение проблем

#### Проблема: "Page build failed"
- Проверьте логи в разделе `Actions`
- Убедитесь, что все зависимости установлены
- Проверьте синтаксис в файлах документации

#### Проблема: "404 Not Found"
- Убедитесь, что `baseUrl` в `docusaurus.config.ts` правильный
- Проверьте, что GitHub Pages включен
- Убедитесь, что workflow завершился успешно

#### Проблема: "Permission denied"
- Проверьте настройки прав доступа в `Settings` → `Actions` → `General`
- Убедитесь, что выбран `Read and write permissions`

### 📚 Полезные ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Docusaurus Deployment](https://docusaurus.io/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
