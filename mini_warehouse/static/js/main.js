// Переключение темы
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'newyear' ? 'light' : 'newyear';

    // Добавляем класс для плавного перехода
    body.classList.add('theme-transition');

    // Меняем тему
    body.setAttribute('data-theme', newTheme);

    // Сохраняем в localStorage
    localStorage.setItem('theme', newTheme);

    // Убираем класс после перехода
    setTimeout(() => {
        body.classList.remove('theme-transition');
    }, 500);

    // Показываем уведомление
    showNotification(`Тема изменена: ${newTheme === 'newyear' ? '🎄 Новогодняя' : '☀️ Светлая'}`, 'info');
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Автоудаление через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);

    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Блюр при скролле
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const body = document.body;

    if (currentScroll > 100) {
        body.classList.add('scrolled');
    } else {
        body.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохранённую тему
    const savedTheme = localStorage.getItem('theme') || 'newyear';
    document.body.setAttribute('data-theme', savedTheme);

    // Назначаем обработчики
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);

    // Анимация для карточек при загрузке
    const cards = document.querySelectorAll('.card, .stat-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
});