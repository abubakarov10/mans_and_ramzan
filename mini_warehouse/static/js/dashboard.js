// dashboard.js - Скрипты для дашборда с реальными взаимодействиями

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

    // Инициализация пагинации
    initPagination();

    // Инициализация фильтров
    initFilters();

    // Инициализация кнопок экспорта
    initExportButtons();
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

// Инициализация пагинации
function initPagination() {
    const pageBtns = document.querySelectorAll('.page-btn');
    const prevBtn = document.querySelector('.page-btn:first-child');
    const nextBtn = document.querySelector('.page-btn:last-child');
    const pageInfo = document.querySelector('.page-info');

    let currentPage = 1;
    const totalPages = 12; // Примерное количество страниц

    // Обновление состояния кнопок
    function updatePagination() {
        // Снимаем активность со всех кнопок
        pageBtns.forEach(btn => {
            btn.classList.remove('active');
            const pageNum = parseInt(btn.textContent);
            if (pageNum === currentPage) {
                btn.classList.add('active');
            }
        });

        // Обновляем информацию о странице
        if (pageInfo) {
            pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
        }

        // Блокируем/разблокируем кнопки навигации
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
            prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
            prevBtn.style.cursor = currentPage === 1 ? 'not-allowed' : 'pointer';
        }

        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
            nextBtn.style.cursor = currentPage === totalPages ? 'not-allowed' : 'pointer';
        }

        // Загружаем данные для текущей страницы
        loadPageData(currentPage);
    }

    // Обработчик кликов по кнопкам страниц
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const btnText = this.textContent.trim();

            if (btnText === '...') return;

            if (btn === prevBtn && currentPage > 1) {
                currentPage--;
            } else if (btn === nextBtn && currentPage < totalPages) {
                currentPage++;
            } else if (!isNaN(parseInt(btnText))) {
                currentPage = parseInt(btnText);
            }

            // Анимация нажатия
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            updatePagination();
            showToast(`Загружена страница ${currentPage}`);
        });
    });

    // Инициализация пагинации
    updatePagination();
}

// Загрузка данных страницы
function loadPageData(page) {
    // Здесь будет загрузка данных с сервера
    // Для демонстрации просто показываем уведомление
    console.log(`Загрузка данных для страницы ${page}...`);

    // Симуляция загрузки
    setTimeout(() => {
        showToast(`Страница ${page} загружена`);
    }, 300);
}

// Инициализация фильтров
function initFilters() {
    const filterBtns = document.querySelectorAll('.sales-filters .btn');
    const dateFrom = document.querySelector('input[type="date"][value="2024-12-01"]');
    const dateTo = document.querySelector('input[type="date"][value="2024-12-25"]');
    const searchInput = document.querySelector('.search-box input');

    // Кнопка применения фильтров
    const applyBtn = document.querySelector('.sales-filters .btn-primary');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const fromDate = dateFrom ? dateFrom.value : '';
            const toDate = dateTo ? dateTo.value : '';

            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            showToast(`Применены фильтры: ${fromDate} - ${toDate}`);

            // Здесь будет запрос к серверу с фильтрами
            applyFilters(fromDate, toDate);
        });
    }

    // Кнопка сброса фильтров
    const resetBtn = document.querySelector('.sales-filters .btn-secondary');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (dateFrom) dateFrom.value = '2024-12-01';
            if (dateTo) dateTo.value = '2024-12-25';
            if (searchInput) searchInput.value = '';

            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            showToast('Фильтры сброшены');

            // Сброс фильтров на сервере
            resetFilters();
        });
    }

    // Поиск по товарам
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                if (query.length >= 2 || query.length === 0) {
                    searchProducts(query);
                }
            }, 500);
        });

        // Кнопка поиска
        const searchBtn = searchInput.nextElementSibling;
        if (searchBtn && searchBtn.classList.contains('btn')) {
            searchBtn.addEventListener('click', function() {
                const query = searchInput.value.trim();
                searchProducts(query);
            });
        }
    }
}

// Применение фильтров
function applyFilters(fromDate, toDate) {
    // Здесь будет AJAX запрос к серверу
    console.log(`Применение фильтров: ${fromDate} - ${toDate}`);

    // Симуляция загрузки
    showToast('Применяем фильтры...', 1500);

    setTimeout(() => {
        // Обновляем данные на странице
        updateFilteredData();
    }, 1500);
}

// Сброс фильтров
function resetFilters() {
    // Здесь будет AJAX запрос к серверу
    console.log('Сброс фильтров');

    // Симуляция загрузки
    showToast('Сбрасываем фильтры...', 1500);

    setTimeout(() => {
        // Обновляем данные на странице
        updateFilteredData(true);
    }, 1500);
}

// Поиск товаров
function searchProducts(query) {
    if (!query) {
        // Если запрос пустой, показываем все товары
        updateFilteredData(true);
        return;
    }

    // Здесь будет AJAX запрос к серверу
    console.log(`Поиск товаров: ${query}`);

    showToast(`Поиск: ${query}`, 1500);

    setTimeout(() => {
        // Симуляция поиска
        const searchResults = [
            { name: 'Смартфон iPhone 15 Pro', category: 'Электроника', stock: 42, price: '₽ 89,990', status: 'В наличии' },
            { name: 'Ноутбук ASUS ROG Strix', category: 'Электроника', stock: 8, price: '₽ 149,990', status: 'Мало' }
        ];

        updateSearchResults(searchResults);
    }, 1000);
}

// Обновление данных после фильтрации
function updateFilteredData(reset = false) {
    // Здесь будет обновление DOM с новыми данными
    if (reset) {
        showToast('Показаны все товары');
    } else {
        showToast('Данные обновлены по фильтрам');
    }
}

// Обновление результатов поиска
function updateSearchResults(results) {
    // Здесь будет обновление таблицы с результатами поиска
    console.log('Обновление результатов поиска:', results);

    if (results.length === 0) {
        showToast('Ничего не найдено');
    } else {
        showToast(`Найдено ${results.length} товаров`);
    }
}

// Инициализация кнопок экспорта
function initExportButtons() {
    const exportBtns = document.querySelectorAll('.btn[class*="export"], .btn:has(.fa-download)');

    exportBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Определяем тип экспорта
            const pageType = getCurrentPageType();
            exportData(pageType);
        });
    });
}

// Определение типа текущей страницы
function getCurrentPageType() {
    const path = window.location.pathname;

    if (path.includes('products')) return 'products';
    if (path.includes('sales')) return 'sales';
    if (path.includes('reports')) return 'reports';
    if (path.includes('profit')) return 'profit';

    return 'dashboard';
}

// Экспорт данных
function exportData(type = 'dashboard') {
    showToast(`Подготовка экспорта ${type}...`, 2000);

    setTimeout(() => {
        let csvData = '';
        let filename = '';

        switch(type) {
            case 'products':
                csvData = generateProductsCSV();
                filename = `suram_products_export_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'sales':
                csvData = generateSalesCSV();
                filename = `suram_sales_export_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'reports':
            case 'profit':
                csvData = generateReportsCSV();
                filename = `suram_reports_export_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            default:
                csvData = generateDashboardCSV();
                filename = `suram_export_${new Date().toISOString().split('T')[0]}.csv`;
        }

        showToast('Экспорт завершен! Файл готов к скачиванию.', 3000);

        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 2000);
}

// Генерация CSV для товаров
function generateProductsCSV() {
    return `Наименование,Категория,Остаток,Цена закупки,Цена продажи,Статус,Дата добавления
"Смартфон iPhone 15 Pro","Электроника",42,75000,89990,"В наличии","2024-11-15"
"Ноутбук ASUS ROG Strix","Электроника",8,130000,149990,"Мало","2024-10-20"
"Наушники Sony WH-1000XM5","Аудио",0,30000,34990,"Нет в наличии","2024-09-05"
"Новогодняя ёлка 180см","Праздник",15,5000,7990,"В наличии","2024-12-01"
"Гирлянда LED 10м","Праздник",23,1200,1990,"В наличии","2024-11-28"
"Подарочный набор","Праздник",12,3500,4990,"В наличии","2024-12-10"`;
}

// Генерация CSV для продаж
function generateSalesCSV() {
    return `Номер продажи,Товар,Количество,Цена продажи,Общая сумма,Дата продажи,Статус
"#4892","Смартфон iPhone 15 Pro",1,89990,89990,"2024-12-25 14:30","Завершено"
"#4891","Ноутбук ASUS ROG Strix",2,149990,299980,"2024-12-24 18:15","Завершено"
"#4890","Наушники Sony WH-1000XM5",3,34990,104970,"2024-12-23 11:45","Завершено"
"#4889","Новогодний набор",5,4990,24950,"2024-12-22 09:20","Завершено"
"#4888","Смартфон Samsung Galaxy S23",1,74990,74990,"2024-12-21 16:30","Завершено"`;
}

// Генерация CSV для отчетов
function generateReportsCSV() {
    return `Период,Выручка (Revenue),Себестоимость (Cost),Прибыль (Profit),Количество продаж,Продано товаров,Средний чек
"01.12.2024 - 25.12.2024",1247800,945200,302600,89,247,14020
"01.11.2024 - 30.11.2024",1120500,875000,245500,76,215,14743
"01.10.2024 - 31.10.2024",985600,745000,240600,68,189,14494`;
}

// Генерация CSV для дашборда
function generateDashboardCSV() {
    return `Метрика,Значение,Дата обновления
"Товаров в системе",1247,"2024-12-25"
"Выручка сегодня",89430,"2024-12-25"
"Эффективность",94.2,"2024-12-25"
"Продаж за день",247,"2024-12-25"
"Популярные товары","Смартфон iPhone 15 Pro, Ноутбук ASUS ROG Strix","2024-12-25"`;
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

// Глобальные функции для работы с корзиной (если нужно)
window.addToCart = function(productId, productName, price, quantity = 1) {
    // Здесь будет логика добавления в корзину
    showToast(`Добавлено в корзину: ${productName} (${quantity} шт.)`);

    // Можно сохранять в localStorage
    const cart = JSON.parse(localStorage.getItem('suram_cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }

    localStorage.setItem('suram_cart', JSON.stringify(cart));

    // Обновление счетчика корзины
    updateCartCount();
};

window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('suram_cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Обновляем бейдж корзины, если есть
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
};

// Инициализация корзины при загрузке
document.addEventListener('DOMContentLoaded', function() {
    window.updateCartCount();
});