const THEME_STORAGE_KEY = 'theme';

const applyTheme = (theme, { notify = false } = {}) => {
    const body = document.body;
    const html = document.documentElement;
    const resolvedTheme = theme || 'newyear';

    body.classList.add('theme-transition');
    body.setAttribute('data-theme', resolvedTheme);
    html.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);

    setTimeout(() => {
        body.classList.remove('theme-transition');
    }, 500);

    if (notify) {
        showNotification(
            `Тема изменена: ${resolvedTheme === 'newyear' ? '🎄 Тёмная' : '☀️ Светлая'}`,
            'info',
        );
    }

    document.querySelectorAll('[data-theme-value]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.themeValue === resolvedTheme);
    });
};

// Переключение темы
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'newyear' ? 'light' : 'newyear';

    applyTheme(newTheme, { notify: true });
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const toastContainer =
        document.querySelector('.toast-container') || document.body.appendChild(document.createElement('div'));
    toastContainer.classList.add('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="toast-content">${message}</div>
        <button class="toast-close" type="button" aria-label="Закрыть">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Автоудаление через 5 секунд
    setTimeout(() => {
        toast.remove();
    }, 5000);

    // Закрытие по клику
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
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
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'newyear';
    applyTheme(savedTheme);

    // Назначаем обработчики
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);

    document.querySelectorAll('[data-theme-value]').forEach((button) => {
        button.addEventListener('click', () => {
            applyTheme(button.dataset.themeValue, { notify: true });
        });
    });

    // Анимация для карточек при загрузке
    const cards = document.querySelectorAll('.card, .stat-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });

    document.querySelectorAll('.toast-close').forEach((button) => {
        button.addEventListener('click', () => {
            button.closest('.toast')?.remove();
        });
    });

    const productSelect = document.getElementById('id_product');
    const productSearchInput = document.getElementById('productSearchInput');
    const productSearchButton = document.getElementById('productSearchButton');
    const recentSearches = document.getElementById('recentSearches');

    const recentKey = 'recentProductSearches';

    const loadRecentSearches = () => {
        try {
            return JSON.parse(localStorage.getItem(recentKey)) || [];
        } catch (error) {
            return [];
        }
    };

    const saveRecentSearches = (items) => {
        localStorage.setItem(recentKey, JSON.stringify(items));
    };

    const handleChipClick = (chip) => {
        const productId = chip.dataset.productId;
        const productName = chip.dataset.productName || chip.dataset.searchTerm;
        if (productId && productSelect) {
            productSelect.value = productId;
        } else if (productName) {
            const option = findProductOption(productName);
            if (option) {
                selectProduct(option);
            }
        }
        if (productSearchInput && productName) {
            productSearchInput.value = productName;
        }
        if (productName) {
            updateRecentSearches(productName);
        }
    };

    const renderRecentSearches = (items) => {
        if (!recentSearches) {
            return;
        }
        recentSearches.innerHTML = '';
        if (!items.length) {
            const emptyState = document.createElement('span');
            emptyState.className = 'suggestion-empty';
            emptyState.textContent = 'Пока нет недавних поисков.';
            recentSearches.appendChild(emptyState);
            return;
        }
        items.forEach((term) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'suggestion-chip';
            button.dataset.searchTerm = term;
            button.textContent = term;
            button.addEventListener('click', () => handleChipClick(button));
            recentSearches.appendChild(button);
        });
    };

    const updateRecentSearches = (term) => {
        const current = loadRecentSearches().filter((item) => item !== term);
        current.unshift(term);
        const trimmed = current.slice(0, 6);
        saveRecentSearches(trimmed);
        renderRecentSearches(trimmed);
    };

    const findProductOption = (term) => {
        if (!productSelect) {
            return null;
        }
        const normalized = term.toLowerCase();
        return Array.from(productSelect.options).find((option) =>
            option.textContent.toLowerCase().includes(normalized),
        );
    };

    const selectProduct = (option) => {
        if (!option || !productSelect) {
            return;
        }
        productSelect.value = option.value;
        productSelect.dispatchEvent(new Event('change'));
    };

    const handleSearch = () => {
        if (!productSearchInput) {
            return;
        }
        const term = productSearchInput.value.trim();
        if (!term) {
            showNotification('Введите название товара для поиска.', 'info');
            return;
        }
        const option = findProductOption(term);
        if (option) {
            selectProduct(option);
            showNotification(`Найден товар: ${option.textContent}`, 'success');
        } else {
            showNotification('Товар не найден. Проверьте название.', 'error');
        }
        updateRecentSearches(term);
    };

    if (productSearchButton && productSearchInput && productSelect) {
        productSearchButton.addEventListener('click', handleSearch);
        productSearchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSearch();
            }
        });
    }

    const initialRecent = loadRecentSearches();
    renderRecentSearches(initialRecent);

    document.querySelectorAll('.suggestion-chip').forEach((chip) => {
        chip.addEventListener('click', () => handleChipClick(chip));
    });

    const dropdownToggle = document.querySelector('[data-dropdown-toggle]');
    const dropdownMenu = document.querySelector('[data-dropdown-menu]');

    const closeDropdown = () => {
        dropdownMenu?.classList.remove('is-open');
        dropdownToggle?.classList.remove('is-open');
    };

    dropdownToggle?.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = dropdownMenu?.classList.toggle('is-open');
        dropdownToggle?.classList.toggle('is-open', isOpen);
    });

    document.addEventListener('click', (event) => {
        if (!dropdownMenu?.contains(event.target)) {
            closeDropdown();
        }
    });

    const menuToggleButton = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileBackdrop = document.querySelector('[data-drawer-backdrop]');

    const closeDrawer = () => {
        mobileDrawer?.classList.remove('is-open');
        mobileBackdrop?.classList.remove('is-visible');
    };

    menuToggleButton?.addEventListener('click', () => {
        mobileDrawer?.classList.toggle('is-open');
        mobileBackdrop?.classList.toggle('is-visible');
    });

    mobileBackdrop?.addEventListener('click', closeDrawer);

    document.querySelectorAll('[data-drawer-close]').forEach((button) => {
        button.addEventListener('click', closeDrawer);
    });
});
