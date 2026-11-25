# Как сняты материалы

## Окружение

- Unity 6000.6.10f1, WebGL-модуль: `F:\Unity\Editor\6000.6.10f1\Editor\Data\PlaybackEngines\WebGLSupport`.
- Node 22, Playwright + Chromium, sharp, ffmpeg-static — в `node_modules` проекта.
- Локальный статический сервер: `node tools/capture/serve.mjs` → `http://127.0.0.1:8099/`.

## Скриншоты FrostSpace

`node tools/capture/fs-menu.mjs` — открывает зеркало сборки в 1920×1080, ждёт инициализацию Unity (~45 с) и снимает меню. Результат: `docs/design/fs-menu.png`, он же `site/assets/img/hero.png`.

Кадры для галереи взяты из проекта: `Assets/Screenshots/train_play.png`, `Captures/scan_wave_one.png`, `Captures/scan_wave_mid.png`, `Assets/Screenshots/final_depot.png`, `Assets/Screenshots/final_settlement.png`.

## Скриншоты секций лендинга

`node tools/capture/sections.mjs` — снимает `#about`, `#play`, `#ai`, `#roadmap`, `#projects` в 1440×900.

## Hero-варианты

`node tools/capture/variants.mjs` — три варианта в 1440×900: `docs/design/a.html`, `b.html`, `c.html` → `shot-a/b/c.png`. Выбран A.

## BARAKI WebGL

Сборка: `Unity.exe -quit -batchmode -projectPath "F:/Unity Projects/BARAKI" -buildTarget WebGL -executeMethod Game.Editor.WebGLCiBuild.Build -logFile "F:/Unity Projects/BARAKI/Logs/webgl-build.log"`.

Ручной прогон: 2026-11-25, локально, вне CI. Выход: `F:\Unity Projects\BARAKI\build\WebGL`.

## Зеркало сборок

`node tools/deploy/fetch-builds.mjs` — скачивает FrostSpace с `lizardan.github.io/FrostSpace/` в `site/play/frostspace/`, BARAKI — из release-ассета `webgl-demo/baraki-webgl.zip` в `site/play/baraki/`. В git не коммитится.

## Видео

`node tools/capture/record.mjs` — Playwright записывает страницу в webm (25 fps), затем `node tools/media/build-media.mjs` режет и собирает H.264 через ffmpeg-static. Длинные главы — по 15–25 МБ.

Статус на 2026-11-25: запись меню и перехода в игру проверена; полное прохождение требует ручной сессии из-за таймингов заставок.
