#!/usr/bin/env bash
# ASCII 3D Icons for macOS: swaps app icons and sets the wallpaper.
#
#   install/macos/install.sh                 apply icons + wallpaper
#   install/macos/install.sh --icons-only    leave the wallpaper alone
#   install/macos/install.sh --dry-run       list what would change
#
# Or straight from GitHub:
#   curl -fsSL https://raw.githubusercontent.com/leobyday/ascii-icons/main/install/macos/install.sh | bash
set -euo pipefail

REPO_URL="${ASCII3D_REPO:-https://github.com/leobyday/ascii-icons.git}"
CLONE_DIR="${ASCII3D_HOME:-$HOME/.ascii-3d-icons}"
STATE_DIR="$HOME/Library/Application Support/ascii-3d-icons"
APPS_DIR="/Applications"

# Sets an app's icon through NSWorkspace. Prints "ok" or "fail".
SET_ICON_JXA='function run(argv) {
  ObjC.import("AppKit");
  const image = $.NSImage.alloc.initWithContentsOfFile(argv[0]);
  if (!image || image.isNil()) return "fail";
  return $.NSWorkspace.sharedWorkspace.setIconForFileOptions(image, argv[1], 0) ? "ok" : "fail";
}'

dry_run=0
set_wallpaper=1

usage() {
  cat <<'EOF'
ASCII 3D Icons for macOS: swaps app icons and sets the wallpaper.

  install/macos/install.sh                 apply icons + wallpaper
  install/macos/install.sh --icons-only    leave the wallpaper alone
  install/macos/install.sh --dry-run       list what would change
EOF
}
say() { printf '%s\n' "$*"; }
bold() { printf '\033[1m%s\033[0m\n' "$*"; }
die() { printf 'error: %s\n' "$*" >&2; exit 1; }
slug() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'; }

parse_args() {
  for arg in "$@"; do
    case "$arg" in
      --dry-run) dry_run=1 ;;
      --icons-only) set_wallpaper=0 ;;
      -h | --help) usage; exit 0 ;;
      *) die "unknown option: $arg" ;;
    esac
  done
}

# Finds the repo next to this script, or clones it when piped from curl.
locate_repo() {
  local here
  here="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || true)"
  if [ -n "$here" ] && [ -f "$here/apps.tsv" ]; then
    (cd "$here/../.." && pwd)
    return
  fi
  command -v git >/dev/null || die "git is required (run: xcode-select --install)"
  if [ -d "$CLONE_DIR/.git" ]; then
    say "Updating $CLONE_DIR" >&2
    git -C "$CLONE_DIR" pull --ff-only --quiet
  else
    say "Downloading to $CLONE_DIR" >&2
    git clone --depth 1 --quiet "$REPO_URL" "$CLONE_DIR"
  fi
  printf '%s\n' "$CLONE_DIR"
}

# set_icon <png> <app> [sudo]
set_icon() {
  if [ "${3:-}" = sudo ]; then
    sudo osascript -l JavaScript -e "$SET_ICON_JXA" "$1" "$2" 2>/dev/null || echo fail
  else
    osascript -l JavaScript -e "$SET_ICON_JXA" "$1" "$2" 2>/dev/null || echo fail
  fi
}

main() {
  parse_args "$@"
  [ "$(uname)" = Darwin ] || die "this installer is for macOS"

  local repo themed=0 skipped=0 failed=() name model app png
  repo="$(locate_repo)"

  bold "ASCII 3D Icons"
  [ "$dry_run" = 1 ] && say "(dry run: nothing will change)"
  mkdir -p "$STATE_DIR"

  while IFS=$'\t' read -r name model; do
    case "$name" in "" | \#*) continue ;; esac
    app="$APPS_DIR/$name.app"
    png="$repo/icons/macos/$(slug "$name").png"
    if [ ! -d "$app" ]; then skipped=$((skipped + 1)); continue; fi
    if [ ! -f "$png" ]; then say "  ! no icon file for $name (model: $model)"; continue; fi
    if [ "$dry_run" = 1 ]; then say "  would theme  $name"; themed=$((themed + 1)); continue; fi
    if [ "$(set_icon "$png" "$app")" = ok ]; then
      say "  themed       $name"; themed=$((themed + 1)); touch "$app" 2>/dev/null || true
    else
      failed+=("$name")
    fi
  done <"$repo/install/macos/apps.tsv"

  # Apps owned by root (App Store apps, some installers) need admin rights.
  if [ "${#failed[@]}" -gt 0 ] && [ "$dry_run" = 0 ]; then
    say ""
    say "Some apps need your admin password to change their icon."
    if sudo -v; then
      local still=()
      for name in "${failed[@]}"; do
        app="$APPS_DIR/$name.app"
        png="$repo/icons/macos/$(slug "$name").png"
        if [ "$(set_icon "$png" "$app" sudo)" = ok ]; then
          say "  themed       $name"; themed=$((themed + 1)); sudo touch "$app" 2>/dev/null || true
        else
          still+=("$name")
        fi
      done
      failed=("${still[@]+"${still[@]}"}")
    fi
  fi

  if [ "$set_wallpaper" = 1 ]; then
    local wallpaper="$repo/icons/wallpapers/macos.png"
    if [ "$dry_run" = 1 ]; then
      say "  would set    wallpaper"
    else
      if [ ! -f "$STATE_DIR/previous-wallpaper" ]; then
        osascript -e 'tell application "System Events" to get picture of desktop 1' >"$STATE_DIR/previous-wallpaper" 2>/dev/null || true
      fi
      if osascript -e "tell application \"System Events\" to tell every desktop to set picture to POSIX file \"$wallpaper\"" >/dev/null 2>&1; then
        say "  set          wallpaper"
      else
        say "  ! couldn't set the wallpaper: allow Terminal to control System Events, or set $wallpaper by hand"
      fi
    fi
  fi

  if [ "$dry_run" = 0 ]; then
    killall Dock 2>/dev/null || true
    killall Finder 2>/dev/null || true
  fi

  say ""
  bold "Done: $themed app icons themed ($skipped apps in the set aren't installed)."
  if [ "${#failed[@]}" -gt 0 ] && [ -n "${failed[0]}" ]; then
    say "Couldn't change:"
    printf '  - %s\n' "${failed[@]}"
    say "Allow Terminal in System Settings > Privacy & Security > App Management, then run this again."
  fi
  say "App updates can restore an original icon; just run this again."
  say "Undo everything with: $repo/install/macos/uninstall.sh"
}

main "$@"
