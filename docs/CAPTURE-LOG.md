# Как сняты материалы

## Окружение

- Unity 6000.6.10f1, WebGL-модуль: `F:\Unity\Editor\6000.6.10f1\Editor\Data\PlaybackEngines\WebGLSupport`.
- Node 22, Playwright + Chromium, sharp, ffmpeg-static — в `node_modules` проекта.
- Локальный статический сервер: `node tools/capture/serve.mjs` → `http://127.0.0.1:8099/`.

## Скриншоты FrostSpace

Новая сборка (2026-11-26) снята локально: `node tools/capture/fs-menu.mjs` и `MODE=stills node tools/capture/fs-new.mjs`. Результаты: `docs/design/new-menu.png` (1920×1080, он же `site/assets/img/hero.png`), `new-char.png` (`site/assets/img/char.png`), `new-train.png` и `new-train2.png` (`site/assets/img/train.png`).

Старые кадры `scan.png`, `depot.png`, `frontier.png` оставлены в галерее как дополнительные места; видео целиком переснято на новой сборке.

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

`MODE=video node tools/capture/fs-new.mjs` — Playwright записывает живой проход новой сборки: меню, выбор корпуса, поезд (webm 1600×900, 25 fps). Затем `node tools/media/trailer-live.mjs` собирает трейлер 50 с из реальных клипов: меню 57–68 с, кадр выбора корпуса, поезд 100–116 с, карточка, поезд 125–137 с, финальная карточка; музыка — тема игры, фейды в чёрный. Отдельный клип поезда 100–130 с идёт в раздел «живой геймплей».

Статус на 2026-11-26: трейлер и клип поезда пересняты на последней сборке. Полное прохождение с диалогом и аварией требует ручной сессии: луч диалога идёт из центра камеры, автоматическому вводу нужно точное наведение.
