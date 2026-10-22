# APEX Ultra Highway Racing

A browser-based 3D arcade highway racing prototype built with HTML, CSS, JavaScript, and Three.js.

## Play online with GitHub Pages

The repository contains a GitHub Actions deployment workflow at `.github/workflows/deploy.yml`.

**One-time setup required:** open this repository's **Settings → Pages**, then under **Build and deployment → Source**, choose **GitHub Actions**. The workflow will then deploy the static site when code is pushed to `main`.

After the workflow succeeds, the game should be available at:
https://utkarshydv27.github.io/APEX-CAR/

You can check deployment progress under the repository's **Actions** tab.

## Features

- Multi-lane divided highway with lane markings, median, shoulders, rumble strips, and guardrails.
- Roadside signs, lamp posts, trees, and distant hills.
- 3D sports-car model with a procedural fallback.
- Traffic, collisions, speed/distance HUD, pause, and restart.
- Keyboard and mobile touch controls.
- Three.js lighting, shadows, fog, and PBR-style materials.

## Run locally on Windows

1. Install free Python 3 from https://www.python.org/downloads/ and enable Python in PATH.
2. Download or clone this repository.
3. Double-click `START_GAME.bat`.
4. Keep the terminal window open while playing.

The launcher opens the game at a free localhost port. An internet connection is required for Three.js and the remote vehicle model.

## Controls

| Input | Action |
| --- | --- |
| W / Arrow Up | Accelerate |
| S / Arrow Down | Brake |
| A / Arrow Left | Steer left |
| D / Arrow Right | Steer right |
| P | Pause / resume |
| Enter | Start / restart |
| Touch controls | Mobile driving |

## Assets and licenses

- Three.js is distributed under the MIT license: https://github.com/mrdoob/three.js
- The external Spectral GT RS model is provided by its author as CC0 1.0: https://github.com/JaronKBragg7337/spectral-gt-rs

The highway and scenery are original game environment assets, not an exact replica of a real-world road.

## Known limitations

This is an arcade prototype, not a AAA simulator. External assets require an internet connection.