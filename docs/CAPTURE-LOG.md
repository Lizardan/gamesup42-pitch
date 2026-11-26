# Как сняты материалы

## Окружение

- Unity 6000.6.10f1, WebGL-модуль: `F:\Unity\Editor\6000.6.10f1\Editor\Data\PlaybackEngines\WebGLSupport`.
- Node 22, Playwright + Chromium, sharp, ffmpeg-static — в `node_modules` проекта.
- Локальный статический сервер: `node tools/capture/serve.mjs` → `http://127.0.0.1:8099/`.

## Скриншоты FrostSpace

Новая сборка (2026-11-26): меню и корпус сняты Playwright (`fs-new.mjs`); кадры вагона, погрузки, станции и R7 — из авторской записи прохождения (`docs/design/u-*.png`, главы ниже). Легаси-кадры (сонар, посёлок, фронтир) удалены из галереи.

## Сборка FrostSpace

Локально: `Unity.exe -quit -batchmode -projectPath "F:/Unity Projects/FrostSpace" -buildTarget WebGL -executeMethod FrostSpace.Editor.BuildWebGL.PerformBuild -logFile "F:/Unity Projects/FrostSpace/Logs/webgl-local.log"`.

Результат: 30 МБ, 7 мин 38 с, `Builds/webgl-result.json` — `Succeeded`.

Причина локальной сборки: game-ci не имеет образа `unityci/editor:ubuntu-6000.6.10f1-webgl-3`, поэтому облачный workflow падает до старта Unity. Сборка публикуется release-ассетом `webgl-latest/frostspace-webgl.zip`; `tools/deploy/fetch-builds.mjs` забирает её оттуда, а при отсутствии — падает обратно на живой Pages.

## Скриншоты секций лендинга

`node tools/capture/sections.mjs` — снимает `#about`, `#play`, `#ai`, `#roadmap`, `#projects` в 1440×900.

## Hero-варианты

`node tools/capture/variants.mjs` — три варианта в 1440×900: `docs/design/a.html`, `b.html`, `c.html` → `shot-a/b/c.png`. Выбран A.

## BARAKI WebGL

Сборка: `Unity.exe -quit -batchmode -projectPath "F:/Unity Projects/BARAKI" -buildTarget WebGL -executeMethod Game.Editor.WebGLCiBuild.Build -logFile "F:/Unity Projects/BARAKI/Logs/webgl-build9.log"`.

Что включает build-метод и веб-режим:
- локальный авторитет (`MatchSessionService.UseLocalDev` в `MatchSessionBootstrap`);
- пропуск апдейтера и UGS, прямой вход в главное меню без лаунчера;
- авто-подтверждение выбора расы, скрытие оверлеев бонусов и порядка героев (авто-бонус уже применён);
- сжатие командных текстур для WebGL: 512 px, ASTC 8×8, только платформенный оверрайд;
- stripping движка, exception support = None, Brotli + fallback.

Итог: 98,4 МБ данных, проходит лимит GitHub Pages. Сборка публикуется release-ассетом `webgl-demo/baraki-webgl.zip`; сайт забирает её в `site/play/baraki/`.

Полноэкранный шаблон: `index.html` собирается из шаблона FrostSpace скриптом `tools/deploy/publish-baraki.mjs` с подстановкой имён файлов BARAKI (без пересборки).

## Зеркало сборок

`node tools/deploy/fetch-builds.mjs` — скачивает FrostSpace с `lizardan.github.io/FrostSpace/` в `site/play/frostspace/`, BARAKI — из release-ассета `webgl-demo/baraki-webgl.zip` в `site/play/baraki/`. В git не коммитится.

## Видео

Трейлер и геймплей смонтированы из авторской записи прохождения (2026-11-26, 2:54, 2558×1270, со звуком): `C:/Users/Lizardan/Desktop/Запись 2026-11-26 023953.mp4`.

- `node tools/media/cards.mjs` — титры и метки в стиле сайта (Playwright, Manrope/JetBrains Mono): `card-title.png` (вагон), `card-end.png` (дым на депо), `label-*.png`.
- `node tools/media/montage.mjs` — клипы 1600×794/25 fps с виньеткой, затемнением и drawtext-метками; concat и микс. Звук игры убран, поверх — `Music_FrostSpaceTheme.mp3`.
- Трейлер 56 с: титр, меню 10–18, посадка 33–38, диалог 45–51, погрузка 66–76, дым 112–122, R7 136–146, финальная карточка.
- Геймплей 2:12: запись 33–165 с с метками «01 / ПОЕЗД», «02 / ПОГРУЗКА», «03 / ДЕПО». В разделе видео — две вкладки.

Кадры галереи `train/carry/depot/r7` и картинка механик (`mechanics.png`, дым на станции) — из той же записи. Легаси-кадры удалены. Woodberry-интерактив проверен Playwright: `wood-1/2/3.png`, живой прогон — `wood-live-1/2/3.png`.

## Приёмочные проверки (2026-11-26)

- Lighthouse mobile (живой сайт): **98/100**, LCP 2,0 с, TBT 0 мс, CLS 0 — план требует ≥85.
- Ссылки сайта: 22 ссылки, 11 якорей, **0 битых**; консоль — 0 ошибок.
- Внешние ссылки из `LINKS.md` и `SUBMISSION.md`: 11, **0 битых**.
- Mobile 390 / 768 / 1440 — проверено скриншотами.
- Кадры галереи переведены в WebP q82: 5,7 → 0,8 МБ, lazy + `display=swap`.
- BARAKI: 10-минутный сокс — скрипт `tools/capture/soak-baraki.mjs`, лог `docs/design/soak.log` (проверка «волны идут без падений»).
