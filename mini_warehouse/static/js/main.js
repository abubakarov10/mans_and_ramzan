// Переключение темы
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.classList.add('theme-transition');
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    setTimeout(() => document.body.classList.remove('theme-transition'), 500);

    showNotification(`Тема изменена: ${newTheme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая'}`, 'info');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 5000);
    notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());
}

function getCSRFToken() {
    return document.cookie
        .split(';')
        .map(c => c.trim())
        .find(c => c.startsWith('csrftoken='))
        ?.split('=')[1];
}

// Снег
function initSnowflakes() {
    const container = document.getElementById('snowflakes');
    if (!container) return;

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

// ✅ ОДИН DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    initSnowflakes();

    // Theme toggles
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
        toggle.addEventListener('click', toggleTheme);
    });

    // ✅ Dropdown "Дополнительно"
    document.querySelectorAll('.nav-dropdown-toggle').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.closest('.nav-dropdown');
            dropdown.classList.toggle('is-open');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown.is-open').forEach((d) => d.classList.remove('is-open'));
    });

    // ✅ Панель добавления товара
    const addPanel = document.getElementById('addProductPanel');
    const openAddPanelBtn = document.getElementById('openAddPanelBtn');
    const closePanelBtns = document.querySelectorAll('#addProductPanel .close-panel-btn');
    const addProductBtn = document.getElementById('addProductBtn');

    if (openAddPanelBtn && addPanel) {
        openAddPanelBtn.addEventListener('click', () => addPanel.classList.add('open'));
    }

    closePanelBtns.forEach((btn) => {
        btn.addEventListener('click', () => addPanel.classList.remove('open'));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') addPanel?.classList.remove('open');
    });

    // ✅ Реальное добавление товара в БД через AJAX
    if (addProductBtn) {
        addProductBtn.addEventListener('click', async () => {
            const name = document.getElementById('productName')?.value?.trim();
            const category = document.getElementById('productCategory')?.value?.trim();
            const stock = document.getElementById('productStock')?.value;
            const sale_price = document.getElementById('productPrice')?.value;

            if (!name || !category || !stock || !sale_price) {
                showNotification('Заполни все поля', 'error');
                return;
            }

            try {
                const resp = await fetch('/products/quick-add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: new URLSearchParams({ name, category, stock, sale_price }),
                });

                const data = await resp.json();
                if (!resp.ok || !data.ok) {
                    showNotification(data.error || 'Ошибка при добавлении товара', 'error');
                    return;
                }

                // ✅ Добавляем строку в таблицу на главной сразу
                const tbody = document.getElementById('popularProductsTbody');
                if (tbody) {
                    const p = data.product;

                    const tr = document.createElement('tr');
                    tr.setAttribute('data-product-id', p.id);

                    const statusHtml = Number(p.stock) > 0
                        ? `<span class="status status-in-stock">В наличии</span>`
                        : `<span class="status status-out">Нет в наличии</span>`;

                    tr.innerHTML = `
                        <td>
                            <div class="product-info">
                                <div class="product-icon">📦</div>
                                <div>
                                    <div class="product-name">${p.name}</div>
                                    <div class="product-sku">ID: ${p.id}</div>
                                </div>
                            </div>
                        </td>
                        <td><span class="category-badge">${p.category || '—'}</span></td>
                        <td><span class="stock-count">${p.stock} шт.</span></td>
                        <td><span class="price">₽ ${Math.round(p.sale_price)}</span></td>
                        <td>${statusHtml}</td>
                        <td>
                            <div class="action-buttons">
                                <a class="btn-icon btn-edit" href="/products/${p.id}/edit/">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <form action="/products/${p.id}/delete/" method="post" style="display:inline;">
                                    <input type="hidden" name="csrfmiddlewaretoken" value="${getCSRFToken()}">
                                    <button class="btn-icon btn-delete" type="submit">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    `;

                    tbody.prepend(tr);
                }

                // ✅ Обновляем метрику "товаров в системе" на +1
                const metricProducts = document.getElementById('metricProductsCount');
                if (metricProducts) {
                    const current = parseInt(metricProducts.textContent || '0', 10);
                    metricProducts.textContent = String(current + 1);
                }

                showNotification(`Товар “${name}” добавлен ✅`, 'success');
                addPanel.classList.remove('open');

                // сброс полей
                document.getElementById('productName').value = '';
                document.getElementById('productCategory').value = '';
                document.getElementById('productStock').value = '10';
                document.getElementById('productPrice').value = '1000';

            } catch (err) {
                showNotification('Ошибка сети при добавлении товара', 'error');
            }
        });
    }
});
