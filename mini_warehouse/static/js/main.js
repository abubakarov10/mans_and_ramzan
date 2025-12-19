// Переключение темы
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Добавляем класс для плавного перехода
    document.body.classList.add('theme-transition');

    // Меняем тему
    root.setAttribute('data-theme', newTheme);

    // Сохраняем в localStorage
    localStorage.setItem('theme', newTheme);

    // Убираем класс после перехода
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 500);

    // Показываем уведомление
    showNotification(`Тема изменена: ${newTheme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая'}`, 'info');
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
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Назначаем обработчики
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
        toggle.addEventListener('click', toggleTheme);
    });

    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        mobileDrawer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.closest('a') || target.closest('button')) {
                mobileDrawer.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('click', (event) => {
            if (!mobileDrawer.classList.contains('is-open')) {
                return;
            }

            if (!mobileDrawer.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileDrawer.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const dropdown = toggle.closest('.nav-dropdown');
            const isOpen = dropdown.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown.is-open').forEach((dropdown) => {
            dropdown.classList.remove('is-open');
            dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
    });

    // Анимация для карточек при загрузке
    const cards = document.querySelectorAll('.card, .stat-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
});
