// dashboard.js - Скрипты для дашборда

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация снежинок
    initSnowflakes();

    // Инициализация активного пункта меню
    initActiveMenu();

    // Инициализация уведомлений
    initNotifications();

    // Инициализация графика продаж
    initSalesChart();

    // Инициализация кнопок быстрых действий
    initQuickActions();

    // Инициализация обновления времени в уведомлениях
    initTimeUpdates();

    // Инициализация метрик
    initMetrics();

    // Инициализация интерактивных элементов таблицы
    initTableInteractions();

    // Инициализация кнопок в таблице
    initTableButtons();
});

// Создание снежинок
function initSnowflakes() {
    const snowflakesContainer = document.getElementById('snowflakes');
    if (!snowflakesContainer) return;

    const snowflakeCount = Math.min(35, Math.floor(window.innerWidth / 35));

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        const size = Math.random() * 5 + 2;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;

        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.opacity = Math.random() * 0.4 + 0.2;

        const duration = Math.random() * 12 + 8;
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${Math.random() * 4}s`;

        snowflakesContainer.appendChild(snowflake);
    }
}

// Инициализация активного пункта меню
function initActiveMenu() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    // Убираем active со всех ссылок
    navLinks.forEach(link => {
        link.classList.remove('active');

        // Проверяем, соответствует ли ссылка текущему пути
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath ||
            (currentPath === '/' && linkPath === '/') ||
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
}

// Уведомления
function initNotifications() {
    const notificationCount = document.querySelector('.notification-count');
    const notifications = document.querySelectorAll('.notification.new');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const closeButtons = document.querySelectorAll('.notification-close');

    if (!notificationCount) return;

    // Обновление счетчика
    function updateNotificationCount() {
        const newNotifications = document.querySelectorAll('.notification.new:not(.hidden)');
        const count = newNotifications.length;
        notificationCount.textContent = count;

        if (count === 0) {
            notificationCount.style.display = 'none';
            if (markAllReadBtn) {
                markAllReadBtn.disabled = true;
                markAllReadBtn.textContent = 'Все прочитаны';
                markAllReadBtn.style.opacity = '0.6';
            }
        } else {
            notificationCount.style.display = 'flex';
            if (markAllReadBtn) {
                markAllReadBtn.disabled = false;
                markAllReadBtn.textContent = 'Отметить все как прочитанные';
                markAllReadBtn.style.opacity = '1';
            }
        }
    }

    // Закрытие уведомления
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const notification = this.closest('.notification');
            if (notification.classList.contains('new')) {
                notification.classList.remove('new');
                notification.classList.add('read');
            }
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';

            setTimeout(() => {
                notification.style.display = 'none';
                updateNotificationCount();
            }, 300);
        });
    });

    // Отметить все как прочитанные
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            document.querySelectorAll('.notification.new').forEach(notification => {
                notification.classList.remove('new');
                notification.classList.add('read');

                notification.style.opacity = '0';
                notification.style.transform = 'translateX(20px)';

                setTimeout(() => {
                    notification.style.display = 'none';
                }, 300);
            });

            setTimeout(updateNotificationCount, 350);
        });
    }

    // Анимация появления уведомлений
    setTimeout(() => {
        notifications.forEach((notification, index) => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-15px)';

            setTimeout(() => {
                notification.style.transition = 'all 0.3s ease';
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 80 * (index + 1));
        });
    }, 500);

    updateNotificationCount();
}

// График продаж
function initSalesChart() {
    const chartBars = document.querySelectorAll('.chart-bar');
    const totalRevenueEl = document.querySelector('.stat-value:first-child');

    if (!chartBars.length) return;

    // Подсчет общей выручки
    let totalRevenue = 0;
    chartBars.forEach(bar => {
        const value = parseInt(bar.getAttribute('data-value')) || 0;
        totalRevenue += value;
    });

    // Форматирование чисел
    function formatNumber(num) {
        if (num >= 1000000) {
            return '₽ ' + (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return '₽ ' + (num / 1000).toFixed(1) + 'K';
        }
        return '₽ ' + num.toLocaleString();
    }

    // Обновление общей выручки
    if (totalRevenueEl) {
        totalRevenueEl.textContent = formatNumber(totalRevenue);
    }

    // Интерактивность столбцов
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            const value = parseInt(this.getAttribute('data-value')) || 0;
            const barValue = this.querySelector('.bar-value');
            if (barValue) {
                barValue.textContent = formatNumber(value);
            }

            // Подсветка столбца
            this.style.boxShadow = '0 0 15px rgba(255, 217, 61, 0.4)';
        });

        bar.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });

        bar.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value')) || 0;
            const day = this.closest('.chart-bar-container').querySelector('.chart-label').textContent;
            showToast(`Выручка за ${day}: ${formatNumber(value)}`);
        });
    });
}

// Быстрые действия
function initQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');

    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Проверяем, если ссылка ведет на реальную страницу
            const href = this.getAttribute('href');
            if (href && href !== '#' && href !== '') {
                // Реальная навигация
                return;
            }

            e.preventDefault();

            // Анимация нажатия
            this.style.transform = 'translateX(2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateX(2px) scale(1)';
            }, 150);

            // Показ сообщения в зависимости от типа действия
            const action = this.getAttribute('data-action');
            let message = '';

            switch(action) {
                case 'quick-sale':
                    message = 'Открывается форма быстрой продажи...';
                    // Можете добавить модальное окно или перенаправление
                    setTimeout(() => {
                        window.location.href = '/sales/new/';
                    }, 500);
                    break;
                case 'pro-sale':
                    message = 'Запускается режим профессиональной продажи...';
                    // Здесь можно открыть модальное окно с формой
                    break;
                case 'create-report':
                    message = 'Генерация отчёта...';
                    setTimeout(() => {
                        window.location.href = '/reports/';
                    }, 500);
                    break;
                case 'export-data':
                    message = 'Подготовка данных для экспорта...';
                    // Здесь можно добавить логику экспорта
                    simulateExport();
                    break;
            }

            if (message) {
                showToast(message);
            }
        });
    });
}

// Симуляция экспорта данных
function simulateExport() {
    showToast('Подготовка данных для экспорта...', 2000);

    setTimeout(() => {
        showToast('Экспорт завершен! Файл готов к скачиванию.', 3000);

        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(generateSampleCSV());
        link.download = 'suram_export_' + new Date().toISOString().split('T')[0] + '.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 2000);
}

function generateSampleCSV() {
    return `Товар,Категория,Остаток,Цена,Статус,Продажи
"Смартфон iPhone 15 Pro",Электроника,42,89990,"В наличии",125
"Ноутбук ASUS ROG Strix",Электроника,8,149990,"Мало",89
"Наушники Sony WH-1000XM5",Аудио,0,34990,"Нет в наличии",67
"Новогодняя ёлка 1.8м",Новогодние товары,15,12990,"В наличии",42
"Шоколадный набор",Новогодние товары,120,2990,"В наличии",189`;
}

// Обновление времени в уведомлениях
function initTimeUpdates() {
    function updateTimeElements() {
        const timeElements = document.querySelectorAll('.notification-time[data-time]');

        timeElements.forEach(element => {
            const timeString = element.getAttribute('data-time');
            if (!timeString) return;

            const time = new Date(timeString);
            const now = new Date();
            const diffMs = now - time;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            let text = '';
            if (diffMins < 1) {
                text = 'только что';
            } else if (diffMins < 60) {
                text = `${diffMins} ${getNoun(diffMins, 'минуту', 'минуты', 'минут')} назад`;
            } else if (diffHours < 24) {
                text = `${diffHours} ${getNoun(diffHours, 'час', 'часа', 'часов')} назад`;
            } else if (diffDays < 7) {
                text = `${diffDays} ${getNoun(diffDays, 'день', 'дня', 'дней')} назад`;
            } else {
                text = time.toLocaleDateString('ru-RU');
            }

            element.textContent = text;
        });
    }

    function getNoun(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    }

    // Обновляем время при загрузке и каждую минуту
    updateTimeElements();
    setInterval(updateTimeElements, 60000);
}

// Метрики
function initMetrics() {
    const metricCards = document.querySelectorAll('.metric-card');

    metricCards.forEach(card => {
        card.addEventListener('click', function() {
            const label = this.querySelector('.metric-label').textContent;
            const value = this.querySelector('.metric-value').textContent;

            // Анимация нажатия
            this.style.transform = 'translateY(-3px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1)';
            }, 150);

            // Показ деталей
            showToast(`${label}: ${value}`);
        });
    });
}

// Интерактивные элементы таблицы
function initTableInteractions() {
    // Клик по строке таблицы
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const productName = this.querySelector('.product-name').textContent;
            const status = this.querySelector('.status').textContent;
            const price = this.querySelector('.price').textContent;

            showToast(`${productName} | ${status} | ${price}`, 2500);
        });
    });
}

// Кнопки в таблице
function initTableButtons() {
    // Кнопки продажи
    const sellButtons = document.querySelectorAll('.btn-sell');
    sellButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const product = this.getAttribute('data-product');

            // Анимация нажатия
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            showToast(`Быстрая продажа: ${product}`, 2000);
            setTimeout(() => {
                window.location.href = '/sales/new/?product=' + encodeURIComponent(product);
            }, 500);
        });
    });

    // Кнопки редактирования
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const product = this.getAttribute('data-product');

            // Анимация нажатия
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            showToast(`Редактирование: ${product}`, 2000);
            setTimeout(() => {
                window.location.href = '/products/edit/?product=' + encodeURIComponent(product);
            }, 500);
        });
    });

    // Кнопки заказа
    const orderButtons = document.querySelectorAll('.btn-order');
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const product = this.getAttribute('data-product');

            // Анимация нажатия
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            showToast(`Заказ товара: ${product}`, 2000);
            // Здесь можно открыть форму заказа
        });
    });
}

// Вспомогательные функции
function showToast(message, duration = 2000) {
    // Удаляем старый тост, если есть
    const oldToast = document.querySelector('.toast');
    if (oldToast) {
        oldToast.remove();
    }

    // Создаем новый тост
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--glass);
        backdrop-filter: blur(10px);
        border: 2px solid var(--glass-border);
        border-radius: 8px;
        padding: 10px 16px;
        color: var(--light);
        font-weight: 500;
        font-size: 0.9rem;
        z-index: 10000;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 280px;
        word-wrap: break-word;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(toast);

    // Анимация появления
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    // Автоматическое скрытие
    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

// Адаптация при ресайзе
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Пересоздаем снежинки при изменении размера окна
        const snowflakes = document.getElementById('snowflakes');
        if (snowflakes) {
            snowflakes.innerHTML = '';
            initSnowflakes();
        }
    }, 250);
});