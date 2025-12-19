// dashboard.js - Полностью функциональный скрипт для SuRam

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех модулей
    initSnowflakes();
    initActiveMenu();
    initNotifications();
    initSalesChart();
    initQuickActions();
    initTimeUpdates();
    initMetrics();
    initTableInteractions();
    initPagination();
    initFilters();
    initExportButtons();
    initDateValidation();
    initProductCatalog();
    initSalesSystem();
    initShoppingCart();
    initModals();

    // Новая функциональность
    initAddProductPanel();
    initSearchSuggestions();
    initProductOwnership();
    initPushNotifications();

    // Инициализация пользователя
    initUserSession();
});

// ===== 1. ПАНЕЛЬ ДОБАВЛЕНИЯ ТОВАРА =====
function initAddProductPanel() {
    const openBtn = document.getElementById('openAddPanelBtn');
    const panel = document.getElementById('addProductPanel');
    const closeBtns = document.querySelectorAll('.close-panel-btn');
    const addBtn = document.getElementById('addProductBtn');

    if (!openBtn || !panel) return;

    // Открытие панели
    openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openAddProductPanel();
    });

    // Закрытие панели
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAddProductPanel();
        });
    });

    // Добавление товара
    if (addBtn) {
        addBtn.addEventListener('click', addNewProduct);
    }

    // Закрытие по клику вне панели
    panel.addEventListener('click', function(e) {
        if (e.target === panel) {
            closeAddProductPanel();
        }
    });
}

function openAddProductPanel() {
    const panel = document.getElementById('addProductPanel');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    showToast('Добавьте новый товар');
}

function closeAddProductPanel() {
    const panel = document.getElementById('addProductPanel');
    panel.classList.remove('open');
    document.body.style.overflow = '';

    // Очистка формы
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productStock').value = '10';
    document.getElementById('productPrice').value = '1000';
}

function addNewProduct() {
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const price = parseInt(document.getElementById('productPrice').value);

    if (!name) {
        showPushNotification('Введите название товара', 'error');
        document.getElementById('productName').focus();
        return;
    }

    if (!category) {
        showPushNotification('Выберите категорию', 'error');
        return;
    }

    if (isNaN(stock) || stock < 0) {
        showPushNotification('Введите корректное количество', 'error');
        return;
    }

    if (isNaN(price) || price <= 0) {
        showPushNotification('Введите корректную цену', 'error');
        return;
    }

    // Создание нового товара
    const productId = 'prod_' + Date.now();
    const currentUser = getCurrentUser();

    // Добавление в таблицу
    addProductToTable({
        id: productId,
        name: name,
        category: category,
        stock: stock,
        price: price,
        owner: currentUser.id,
        sku: 'SKU: ' + generateSKU(name),
        status: stock > 5 ? 'В наличии' : stock > 0 ? 'Мало' : 'Нет в наличии'
    });

    // Закрытие панели
    closeAddProductPanel();

    // Уведомление
    showPushNotification(`Товар "${name}" успешно добавлен!`, 'success');

    // Обновление счетчика товаров
    updateProductCount();
}

function addProductToTable(product) {
    const tableBody = document.querySelector('.table tbody');
    if (!tableBody) return;

    const icon = getProductIcon(product.category);
    const statusClass = product.status === 'В наличии' ? 'status-in-stock' :
                       product.status === 'Мало' ? 'status-low' : 'status-out';

    const currentUser = getCurrentUser();
    const isOwner = product.owner === currentUser.id;

    const row = document.createElement('tr');
    row.setAttribute('data-product-id', product.id);
    row.setAttribute('data-owner', product.owner);

    row.innerHTML = `
        <td>
            <div class="product-info">
                <div class="product-icon">${icon}</div>
                <div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-sku">${product.sku}</div>
                    <div class="product-owner" style="font-size: 0.7rem; color: var(--gray); margin-top: 2px;">
                        <i class="fas fa-${isOwner ? 'user' : 'user-tie'}"></i> ${isOwner ? 'Ваш товар' : 'Коллега'}
                    </div>
                </div>
            </div>
        </td>
        <td><span class="category-badge">${product.category}</span></td>
        <td><span class="stock-count">${product.stock} шт.</span></td>
        <td><span class="price">₽ ${product.price.toLocaleString()}</span></td>
        <td><span class="status ${statusClass}">${product.status}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon btn-sell" data-product="${product.name}" data-product-id="${product.id}">
                    <i class="fas fa-bolt"></i>
                </button>
                <button class="btn-icon btn-edit ${isOwner ? '' : 'disabled'}"
                        data-product="${product.name}"
                        data-product-id="${product.id}"
                        ${!isOwner ? 'title="Нельзя редактировать чужие товары"' : ''}>
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete ${isOwner ? '' : 'disabled'}"
                        data-product="${product.name}"
                        data-product-id="${product.id}"
                        ${!isOwner ? 'title="Нельзя удалять чужие товары"' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    // Вставка в начало таблицы
    tableBody.insertBefore(row, tableBody.firstChild);

    // Добавление обработчиков
    initRowInteractions(row);
}

function getProductIcon(category) {
    const icons = {
        'Электроника': '📱',
        'Аудио': '🎧',
        'Праздник': '🎄',
        'Бытовая техника': '🏠',
        'Канцелярия': '✏️'
    };
    return icons[category] || '📦';
}

function generateSKU(name) {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return prefix + '-' + random;
}

function updateProductCount() {
    const count = document.querySelectorAll('.table tbody tr').length;
    const metricValue = document.querySelector('.metric-value');
    if (metricValue && metricValue.textContent.includes(',')) {
        metricValue.textContent = count.toLocaleString();
    }
}

// ===== 2. СИСТЕМА УВЕДОМЛЕНИЙ =====
function initNotifications() {
    const clearAllBtn = document.querySelector('.btn-clear-all');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const closeBtns = document.querySelectorAll('.notification-close');
    const notificationCount = document.querySelector('.notification-count');

    // Очистка всех уведомлений
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            clearAllNotifications();
        });
    }

    // Отметить все как прочитанные
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllNotificationsAsRead();
        });
    }

    // Закрытие отдельных уведомлений
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const notificationId = this.getAttribute('data-id');
            closeNotification(notificationId);
        });
    });

    // Обновление счетчика
    updateNotificationCounter();
}

function clearAllNotifications() {
    if (!confirm('Удалить все уведомления?')) return;

    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    setTimeout(() => {
        updateNotificationCounter();
        showToast('Все уведомления удалены', 'info');
    }, 400);
}

function markAllNotificationsAsRead() {
    const notifications = document.querySelectorAll('.notification.new');
    notifications.forEach(notification => {
        notification.classList.remove('new');
        notification.classList.add('read');
    });

    updateNotificationCounter();
    showToast('Все уведомления отмечены как прочитанные', 'success');
}

function closeNotification(notificationId) {
    const notification = document.querySelector(`.notification[data-id="${notificationId}"]`);
    if (!notification) return;

    if (notification.classList.contains('new')) {
        notification.classList.remove('new');
        notification.classList.add('read');
    }

    notification.style.opacity = '0';
    notification.style.transform = 'translateX(20px)';

    setTimeout(() => {
        notification.remove();
        updateNotificationCounter();
    }, 300);
}

function updateNotificationCounter() {
    const notificationCount = document.querySelector('.notification-count');
    const newNotifications = document.querySelectorAll('.notification.new');
    const count = newNotifications.length;

    if (notificationCount) {
        notificationCount.textContent = count;
        notificationCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ===== 3. ВЛАДЕНИЕ ТОВАРАМИ =====
function initProductOwnership() {
    const editBtns = document.querySelectorAll('.btn-edit');
    const deleteBtns = document.querySelectorAll('.btn-delete');

    editBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();

            if (this.classList.contains('disabled')) {
                showPushNotification('Вы не можете редактировать чужие товары', 'warning');
                return;
            }

            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product');
            openEditProductModal(productId, productName);
        });
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();

            if (this.classList.contains('disabled')) {
                showPushNotification('Вы не можете удалять чужие товары', 'warning');
                return;
            }

            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product');
            deleteProduct(productId, productName);
        });
    });
}

function openEditProductModal(productId, productName) {
    // Здесь будет загрузка данных товара и открытие модального окна
    const modal = document.getElementById('editProductModal');
    if (!modal) return;

    // Установка значений в форму
    document.getElementById('editProductName').value = productName;

    // Открытие модального окна
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);

    showToast(`Редактирование: ${productName}`);
}

function saveProductChanges() {
    const name = document.getElementById('editProductName').value;
    const stock = document.getElementById('editProductStock').value;
    const price = document.getElementById('editProductPrice').value;
    const category = document.getElementById('editProductCategory').value;

    // Закрытие модального окна
    closeModal('editProductModal');

    showPushNotification(`Товар "${name}" успешно обновлен!`, 'success');
}

function deleteProduct(productId, productName) {
    if (!confirm(`Удалить товар "${productName}"?`)) return;

    const row = document.querySelector(`tr[data-product-id="${productId}"]`);
    if (row) {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            row.remove();
            updateProductCount();
            showPushNotification(`Товар "${productName}" удален`, 'info');
        }, 300);
    }
}

// ===== 4. ПОИСК С ПОДСКАЗКАМИ =====
function initSearchSuggestions() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchInput.parentNode.insertBefore(searchContainer, searchInput);
    searchContainer.appendChild(searchInput);

    const suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    searchContainer.appendChild(suggestions);

    // Пример популярных товаров для подсказок
    const popularProducts = [
        { name: 'iPhone 15 Pro', category: 'Электроника', icon: '📱' },
        { name: 'ASUS ROG Strix', category: 'Электроника', icon: '💻' },
        { name: 'Sony WH-1000XM5', category: 'Аудио', icon: '🎧' },
        { name: 'Новогодняя ёлка', category: 'Праздник', icon: '🎄' },
        { name: 'Гирлянда LED', category: 'Праздник', icon: '✨' }
    ];

    // Обработчик ввода
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        updateSuggestions(query, popularProducts, suggestions);
    });

    // Обработчик фокуса
    searchInput.addEventListener('focus', function() {
        if (this.value.trim() === '') {
            showDefaultSuggestions(popularProducts, suggestions);
        }
    });

    // Закрытие подсказок при клике вне
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            suggestions.classList.remove('active');
        }
    });
}

function updateSuggestions(query, products, container) {
    container.innerHTML = '';

    if (!query) {
        showDefaultSuggestions(products, container);
        return;
    }

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="suggestion-item">
                <div class="suggestion-icon">🔍</div>
                <div class="suggestion-text">Товар не найден</div>
                <div class="suggestion-hint">Попробуйте другой запрос</div>
            </div>
        `;

        // Показываем пуш-уведомление
        showPushNotification(`Товар "${query}" не найден в системе`, 'warning');
    } else {
        filtered.forEach(product => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <div class="suggestion-icon">${product.icon}</div>
                <div class="suggestion-text">${product.name}</div>
                <div class="suggestion-hint">${product.category}</div>
            `;

            item.addEventListener('click', function() {
                const searchInput = document.querySelector('.search-box input');
                searchInput.value = product.name;
                container.classList.remove('active');

                // Выполняем поиск
                performSearch(product.name);
            });

            container.appendChild(item);
        });
    }

    container.classList.add('active');
}

function showDefaultSuggestions(products, container) {
    container.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'suggestion-item';
    title.style.fontWeight = '600';
    title.style.color = 'var(--light)';
    title.style.borderBottom = '2px solid var(--glass-border)';
    title.innerHTML = `
        <div class="suggestion-icon">🔥</div>
        <div class="suggestion-text">Популярные товары</div>
    `;
    container.appendChild(title);

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <div class="suggestion-icon">${product.icon}</div>
            <div class="suggestion-text">${product.name}</div>
            <div class="suggestion-hint">${product.category}</div>
        `;

        item.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-box input');
            searchInput.value = product.name;
            container.classList.remove('active');
            performSearch(product.name);
        });

        container.appendChild(item);
    });

    container.classList.add('active');
}

function performSearch(query) {
    const rows = document.querySelectorAll('.table tbody tr');
    let found = false;

    rows.forEach(row => {
        const productName = row.querySelector('.product-name').textContent.toLowerCase();
        const productCategory = row.querySelector('.category-badge').textContent.toLowerCase();

        if (productName.includes(query.toLowerCase()) ||
            productCategory.includes(query.toLowerCase())) {
            row.style.display = '';
            row.style.animation = 'slideIn 0.3s ease';
            found = true;
        } else {
            row.style.display = 'none';
        }
    });

    if (!found) {
        showPushNotification(`По запросу "${query}" ничего не найдено`, 'warning');
    } else {
        showToast(`Найдено по запросу: "${query}"`);
    }
}

// ===== 5. ПУШ-УВЕДОМЛЕНИЯ =====
function initPushNotifications() {
    // Создаем контейнер для пушей
    const pushContainer = document.createElement('div');
    pushContainer.id = 'push-container';
    pushContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(pushContainer);
}

function showPushNotification(message, type = 'info') {
    const container = document.getElementById('push-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `push-notification push-${type}`;

    const icon = type === 'error' ? '❌' :
                type === 'warning' ? '⚠️' :
                type === 'success' ? '✅' : 'ℹ️';

    notification.innerHTML = `
        <div class="push-icon">${icon}</div>
        <div class="push-content">
            <div class="push-title">${getPushTitle(type)}</div>
            <div class="push-message">${message}</div>
        </div>
        <button class="push-close">&times;</button>
    `;

    container.appendChild(notification);

    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 10);

    // Обработчик закрытия
    notification.querySelector('.push-close').addEventListener('click', function() {
        closePushNotification(notification);
    });

    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            closePushNotification(notification);
        }
    }, 5000);
}

function getPushTitle(type) {
    switch(type) {
        case 'error': return 'Ошибка';
        case 'warning': return 'Внимание';
        case 'success': return 'Успешно';
        default: return 'Информация';
    }
}

function closePushNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// ===== 6. СЕССИЯ ПОЛЬЗОВАТЕЛЯ =====
function initUserSession() {
    // Имитация пользователя (в реальном приложении будет из системы авторизации)
    const currentUser = {
        id: 'user123',
        name: 'Иван Иванов',
        role: 'manager',
        department: 'Продажи'
    };

    localStorage.setItem('suram_current_user', JSON.stringify(currentUser));

    // Обновление интерфейса в соответствии с пользователем
    updateUIForUser(currentUser);
}

function getCurrentUser() {
    const user = localStorage.getItem('suram_current_user');
    return user ? JSON.parse(user) : { id: 'user123', name: 'Иван Иванов' };
}

function updateUIForUser(user) {
    // Можно добавить отображение имени пользователя где-нибудь в интерфейсе
    console.log('Текущий пользователь:', user.name);
}

// ===== 7. ОБНОВЛЕННЫЕ БЫСТРЫЕ ДЕЙСТВИЯ =====
function initQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action-btn');

    quickActions.forEach(action => {
        action.addEventListener('click', function(e) {
            const actionType = this.getAttribute('data-action');

            switch(actionType) {
                case 'quick-sale':
                    // Перенаправление на страницу быстрой продажи
                    window.location.href = 'sale-new.html';
                    break;

                case 'pro-sale':
                    showPushNotification('Режим профессиональной продажи активирован', 'info');
                    // Здесь можно открыть расширенную форму продажи
                    break;

                case 'create-report':
                    generateReport();
                    break;

                case 'export-data':
                    openExportModal();
                    break;
            }
        });
    });
}

function generateReport() {
    showPushNotification('Генерация отчёта начата...', 'info');

    // Имитация генерации отчёта
    setTimeout(() => {
        showPushNotification('Отчёт успешно сгенерирован!', 'success');

        // Создание ссылки для скачивания
        const reportData = `Отчёт SuRam\nДата: ${new Date().toLocaleDateString()}\n\nВыручка: ₽ 89,430\nПродажи: 247\nТоваров в системе: 1,247\n\nСгенерировано системой SuRam`;

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportData);
        link.download = `suram_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 2000);
}

// ===== 8. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function openExportModal() {
    const modal = document.getElementById('exportModal');
    if (!modal) return;

    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

function exportSelectedData() {
    const exportType = document.querySelector('input[name="exportType"]:checked').value;

    closeModal('exportModal');

    showPushNotification(`Экспорт данных (${exportType}) начат...`, 'info');

    setTimeout(() => {
        showPushNotification('Экспорт завершён! Файл скачивается.', 'success');

        // Здесь будет реальный экспорт данных
        exportData(exportType);
    }, 1500);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function showToast(message, type = 'info') {
    // Удаляем старый тост
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();

    // Создаем новый
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Анимация
    setTimeout(() => toast.classList.add('show'), 10);

    // Автоудаление
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Остальные функции (initSnowflakes, initActiveMenu и т.д.) остаются без изменений
// ... (из предыдущего скрипта)