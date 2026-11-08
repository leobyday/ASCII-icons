#!/usr/bin/env bash
# Restores the original app icons and the previous wallpaper.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STATE_DIR="$HOME/Library/Application Support/ascii-3d-icons"
APPS_DIR="/Applications"

# Removes a custom icon through NSWorkspace. Prints "ok" or "fail".
CLEAR_ICON_JXA='function run(argv) {
  ObjC.import("AppKit");
  return $.NSWorkspace.sharedWorkspace.setIconForFileOptions(null, argv[0], 0) ? "ok" : "fail";
}'

clear_icon() {
  if [ "${2:-}" = sudo ]; then
    sudo osascript -l JavaScript -e "$CLEAR_ICON_JXA" "$1" 2>/dev/null || echo fail
  else
    osascript -l JavaScript -e "$CLEAR_ICON_JXA" "$1" 2>/dev/null || echo fail
  fi
}

main() {
  [ "$(uname)" = Darwin ] || { echo "macOS only." >&2; exit 1; }
  local restored=0 needs_sudo=() name _model app

  while IFS=$'\t' read -r name _model; do
    case "$name" in "" | \#*) continue ;; esac
    app="$APPS_DIR/$name.app"
    [ -d "$app" ] || continue
    if [ "$(clear_icon "$app")" = ok ]; then
      echo "  restored  $name"; restored=$((restored + 1)); touch "$app" 2>/dev/null || true
    else
      needs_sudo+=("$name")
    fi
  done <"$REPO/install/macos/apps.tsv"

  if [ "${#needs_sudo[@]}" -gt 0 ] && sudo -v; then
    for name in "${needs_sudo[@]}"; do
      app="$APPS_DIR/$name.app"
      if [ "$(clear_icon "$app" sudo)" = ok ]; then
        echo "  restored  $name"; restored=$((restored + 1)); sudo touch "$app" 2>/dev/null || true
      else
        echo "  ! couldn't restore $name"
      fi
    done
  fi

  local saved="$STATE_DIR/previous-wallpaper" previous
  if [ -s "$saved" ]; then
    previous="$(cat "$saved")"
    if [ -f "$previous" ] && osascript -e "tell application \"System Events\" to tell every desktop to set picture to POSIX file \"$previous\"" >/dev/null 2>&1; then
      echo "  restored  wallpaper"
    fi
    rm -f "$saved"
  fi

  killall Dock 2>/dev/null || true
  killall Finder 2>/dev/null || true
  echo "Restored $restored app icons."
}

main "$@"
