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

// Снег
function initSnowflakes() {
    const container = document.getElementById('snowflakes');
    if (!container) {
        return;
    }

    container.innerHTML = '';
    const snowflakeCount = 40;

    for (let i = 0; i < snowflakeCount; i += 1) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';

        const size = Math.random() * 0.8 + 0.6;
        const left = Math.random() * 100;
        const duration = Math.random() * 6 + 6;
        const delay = Math.random() * 6;

        snowflake.style.left = `${left}%`;
        snowflake.style.fontSize = `${size}em`;
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${delay}s`;

        container.appendChild(snowflake);
    }
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

// ✅✅✅ ОСТАВЛЯЕМ ТОЛЬКО ОДИН DOMContentLoaded ✅✅✅
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохранённую тему
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    initSnowflakes();

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

    // ✅✅✅ ШАГ 1 — Быстрая панель добавления товара ✅✅✅
    const addPanel = document.getElementById('addProductPanel');
    const openAddPanelBtn = document.getElementById('openAddPanelBtn');
    const closePanelBtns = document.querySelectorAll('#addProductPanel .close-panel-btn');
    const addProductBtn = document.getElementById('addProductBtn');

    // Открыть панель
    if (openAddPanelBtn && addPanel) {
        openAddPanelBtn.addEventListener('click', () => {
            addPanel.classList.add('open');
        });
    }

    // Закрыть панель (крестик и "Отмена")
    if (addPanel && closePanelBtns.length) {
        closePanelBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                addPanel.classList.remove('open');
            });
        });
    }

    // Закрыть по клику вне панели
    document.addEventListener('click', (event) => {
        if (!addPanel || !addPanel.classList.contains('open')) return;

        const clickedInside = event.target.closest('#addProductPanel');
        const clickedOpenBtn = event.target.closest('#openAddPanelBtn');

        if (!clickedInside && !clickedOpenBtn) {
            addPanel.classList.remove('open');
        }
    });

    // Закрыть по Escape
    document.addEventListener('keydown', (event) => {
        if (!addPanel || !addPanel.classList.contains('open')) return;
        if (event.key === 'Escape') {
            addPanel.classList.remove('open');
        }
    });

    // Нажатие "Добавить товар" (пока демо)
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            const name = document.getElementById('productName')?.value?.trim();
            const category = document.getElementById('productCategory')?.value?.trim();

            if (!name || !category) {
                showNotification('Заполни название и категорию 🙂', 'error');
                return;
            }

            showNotification(`Товар “${name}” добавлен (демо) ✅`, 'success');
            addPanel.classList.remove('open');
        });
    }

        // ✅✅✅ ШАГ 2 — УВЕДОМЛЕНИЯ (исправлено) ✅✅✅
    const notificationsCard = document.querySelector('.notifications-card');

    if (notificationsCard) {
        const notificationsList = notificationsCard.querySelector('.notifications');
        const badge = notificationsCard.querySelector('.notifications-header-actions .badge');
        const clearAllBtn = document.getElementById('clearAllNotificationsBtn');
        const markAllReadBtn = document.getElementById('markAllReadBtn');

        function updateBadgeCount() {
            if (!badge || !notificationsList) return;
            const count = notificationsList.querySelectorAll('.notification').length;
            badge.textContent = String(count);
        }

        // ✅ Закрытие ОДНОГО уведомления (крестик)
        notificationsCard.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.notification-close');
            if (!closeBtn) return;

            // ВАЖНО: удаляем только уведомления внутри блока notifications
            const item = closeBtn.closest('.notifications .notification');
            if (!item) return;

            item.remove();
            updateBadgeCount();
        });

        // ✅ Отметить все прочитанными
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                if (!notificationsList) return;

                notificationsList.querySelectorAll('.notification.new').forEach((n) => {
                    n.classList.remove('new');
                });

                showNotification('Все уведомления отмечены прочитанными ✅', 'success');
            });
        }

        // ✅ Очистить все уведомления
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (!notificationsList) return;

                notificationsList.innerHTML = '';
                updateBadgeCount();

                showNotification('Уведомления очищены 🧹', 'info');
            });
        }

        // ✅ Первичное обновление бейджа
        updateBadgeCount();
    }

}); // ← ВОТ ЭТА СТРОКА ДОЛЖНА ОСТАТЬСЯ САМОЙ ПОСЛЕДНЕЙ
