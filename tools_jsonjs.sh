#!/bin/sh
# regenerate the classic-script wrappers from the JSON (GitHub Pages and plain static hosts do not load <script type="application/json" src>)
printf 'window.POL_DATA=%s;\n' "$(cat polities.json)" > polities.js
printf 'window.CI_DATA=%s;\n' "$(cat countries_info.json)" > countries_info.js
