HEAD
# Мини-склад «Товары и продажи»

Веб-приложение на Django для учёта товаров, продаж и отчёта по прибыли.

## Возможности MVP
- CRUD товаров (остаток, цены закупки и продажи).
- Продажи с автосписанием остатков.
- Ошибка при попытке продать больше остатка.
- Фильтр продаж по датам.
- Отчёт по выручке/себестоимости/прибыли.

## Политика удаления товара
**A) Удаление запрещено, если есть продажи.**

## Быстрый старт (SQLite по умолчанию)
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python mini_warehouse/manage.py migrate
python mini_warehouse/manage.py runserver
```

Откройте:
- `http://127.0.0.1:8000/products/` — товары
- `http://127.0.0.1:8000/sales/` — продажи
- `http://127.0.0.1:8000/reports/profit/` — отчёт

## PostgreSQL (опционально)
1. Скопируйте `.env.example` в `.env` и заполните значения.
2. Экспортируйте переменные окружения (или используйте любой менеджер env).
3. Запустите миграции и сервер.

```bash
set -a
source .env
set +a

python mini_warehouse/manage.py migrate
python mini_warehouse/manage.py runserver
```

## Миграции
Миграции находятся в `mini_warehouse/apps/**/migrations/`.

## Архитектура
- `apps/products` — товары.
- `apps/sales` — продажи и бизнес-логика списания.
- `apps/reports` — отчёты.
- `templates/` и `static/` — серверные страницы и стили.

origin/main
