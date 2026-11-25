# gamesup42-pitch

Ванпейджер и две играбельные демки для заявки в GamesUp42.

- Лендинг: `site/index.html`
- FrostSpace: `site/play/frostspace/` (зеркало живой сборки)
- BARAKI: `site/play/baraki/` (WebGL-песочница, release-ассет)
- Документация: `docs/`
- Сборки в git не лежат: их подтягивает `tools/deploy/fetch-builds.mjs` перед публикацией.

## Локально

```bash
npm install
node tools/deploy/fetch-builds.mjs --skip-baraki
node tools/capture/serve.mjs      # http://127.0.0.1:8099/
```

## Публикация

Push в `main` → GitHub Actions собирает `site/` с зеркалами сборок и публикует на Pages.
Workflow: `.github/workflows/pages.yml`.

## Скриншоты и видео

```bash
node tools/capture/variants.mjs   # три hero-варианта
node tools/capture/sections.mjs   # скриншоты секций
node tools/capture/record.mjs     # запись геймплея (Playwright)
node tools/media/build-media.mjs  # монтаж, webp, титры
```

## Что где

| Файл | Содержание |
|---|---|
| `docs/RESEARCH.md` | досье трёх проектов |
| `docs/LINKS.md` | живые ссылки и пути |
| `docs/DECISIONS.md` | журнал решений |
| `docs/AI-USAGE.md` | как использовался AI |
| `docs/PRODUCTION-PLAN.md` | план на 6 месяцев |
| `docs/ASSET-CREDITS.md` | лицензии и дисклеймеры |
| `docs/SUBMISSION.md` | готовые ответы для анкеты |
| `docs/CAPTURE-LOG.md` | как сняты материалы |
