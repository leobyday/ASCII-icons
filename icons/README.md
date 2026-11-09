# The icons

Every icon in this set is defined by the same spec, the one the [skill](../skills/ascii-3d-icons/SKILL.md#the-icon-spec) uses to make new ones. Two lines change per icon; the rest is fixed.

```
Subject   what the icon depicts: a generic object (the shared set has no logos: they're trademarks)
Reads as  the two or three parts that carry the shape
Style     fixed: 3D model, 9-character ramp .:-=+*#%@, @ outlines, light from the upper left,
          resting view -0.35 rad turn / 0.22 rad tilt, ink #141414 on #F3F2EE,
          JetBrains Mono Bold, raised keycap tile
Motion    fixed: still, or turning on its own vertical axis (one eased turn every 4.4 s)
```

So a file here is exactly: that subject, built from those parts, in that style. Want one that isn't here? Fill in the two lines and ask the skill.

## Files

| Folder | Format |
| --- | --- |
| [`svg/`](svg) | Every icon, 1024 px keycap tile, characters as editable text |
| [`ios/`](ios) | iPhone app icons, 1024 px PNG, named by app |
| [`macos/`](macos) | Mac app icons, 1024 px PNG, named by app |
| [`wallpapers/`](wallpapers) | Mac (3456 × 2234) and iPhone (1179 × 2556) |

## Catalog

48 icons. Generated from `src/catalog.json` by `node scripts/catalog.js`.

| | Model | Subject | Reads as | Used for |
| --- | --- | --- | --- | --- |
| <img src="svg/bar-chart.svg" width="72" alt="A bar chart"> | `bar-chart` | A bar chart | bars of rising height on a base | Numbers (Mac) |
| <img src="svg/bouncing-balls.svg" width="72" alt="Bouncing balls"> | `bouncing-balls` | Bouncing balls | three balls at different heights over a floor | Cavalry (Mac) |
| <img src="svg/butterfly.svg" width="72" alt="A butterfly"> | `butterfly` | A butterfly | two pairs of wings around a body | Symmetry (Mac) |
| <img src="svg/calendar.svg" width="72" alt="A desk calendar"> | `calendar` | A desk calendar | a page with two binding rings on top | Calendar (iPhone) |
| <img src="svg/camera.svg" width="72" alt="A photo camera"> | `camera` | A photo camera | a box body, a raised lens and a viewfinder bump | Camera (iPhone) |
| <img src="svg/checklist.svg" width="72" alt="A checklist"> | `checklist` | A checklist | three bullets beside three lines | Reminders (iPhone) |
| <img src="svg/chip.svg" width="72" alt="A computer chip"> | `chip` | A computer chip | a square die with pins on every side | Ollama (Mac) |
| <img src="svg/clapperboard.svg" width="72" alt="A film clapperboard"> | `clapperboard` | A film clapperboard | a slate with a striped hinged top | iMovie (Mac) |
| <img src="svg/clock.svg" width="72" alt="A wall clock"> | `clock` | A wall clock | a round face with a rim and two hands | Clock (iPhone) |
| <img src="svg/code-brackets.svg" width="72" alt="Code brackets"> | `code-brackets` | Code brackets | angle brackets around a slash | Visual Studio Code (Mac) |
| <img src="svg/containers.svg" width="72" alt="Shipping containers"> | `containers` | Shipping containers | stacked boxes | Docker (Mac) |
| <img src="svg/flower.svg" width="72" alt="A flower"> | `flower` | A flower | six round petals around a center | Photos (iPhone) |
| <img src="svg/gamepad.svg" width="72" alt="A game controller"> | `gamepad` | A game controller | a rounded controller with two grips | Discord (Mac) |
| <img src="svg/gear.svg" width="72" alt="A gear"> | `gear` | A gear | a toothed wheel with a hole in the middle | Settings (iPhone) |
| <img src="svg/git-branch.svg" width="72" alt="A branching path"> | `git-branch` | A branching path | nodes joined by a line that forks | GitHub Desktop (Mac) |
| <img src="svg/globe.svg" width="72" alt="A globe"> | `globe` | A globe | a sphere with an equator and meridian bands | Chrome (iPhone), Google Chrome (Mac) |
| <img src="svg/handheld-console.svg" width="72" alt="A handheld game console"> | `handheld-console` | A handheld game console | a slab with a screen, a cross and buttons | Switch Console (Mac) |
| <img src="svg/handset.svg" width="72" alt="A telephone handset"> | `handset` | A telephone handset | an arched handle between two cups | Phone (iPhone) |
| <img src="svg/hash.svg" width="72" alt="A hash sign"> | `hash` | A hash sign | two crossing pairs of bars | Slack (Mac) |
| <img src="svg/headphones.svg" width="72" alt="Headphones"> | `headphones` | Headphones | a headband arching over two ear cups | Spotify (Mac) |
| <img src="svg/joystick.svg" width="72" alt="A joystick"> | `joystick` | A joystick | a ball-top stick on a wide base | Arcade (Mac) |
| <img src="svg/keyframe.svg" width="72" alt="A keyframe diamond"> | `keyframe` | A keyframe diamond | a diamond | Rive (Mac) |
| <img src="svg/layers.svg" width="72" alt="Stacked layers"> | `layers` | Stacked layers | offset flat sheets | Framer (Mac) |
| <img src="svg/microphone.svg" width="72" alt="A microphone"> | `microphone` | A microphone | a capsule head on a stand | Wispr Flow (Mac) |
| <img src="svg/music-notes.svg" width="72" alt="Music notes"> | `music-notes` | Music notes | two note heads joined by a beam | Music (iPhone) |
| <img src="svg/note-tile.svg" width="72" alt="A note pad tile"> | `note-tile` | A note pad tile | a square tile with a dotted rule and two ruled lines |  |
| <img src="svg/notepad.svg" width="72" alt="A notepad"> | `notepad` | A notepad | a page with ruled lines and a bound top | Notes (iPhone) |
| <img src="svg/paper-plane.svg" width="72" alt="A paper plane"> | `paper-plane` | A paper plane | a folded dart with a center crease | Telegram (Mac) |
| <img src="svg/paper-stack.svg" width="72" alt="A stack of paper"> | `paper-stack` | A stack of paper | a few fanned sheets | Paper (Mac) |
| <img src="svg/pencil.svg" width="72" alt="A pencil"> | `pencil` | A pencil | a long hexagonal body with a sharpened tip | Pen (Mac) |
| <img src="svg/phone-mockup.svg" width="72" alt="A phone"> | `phone-mockup` | A phone | a tall rounded slab with a screen | Rotato (Mac) |
| <img src="svg/planet.svg" width="72" alt="A ringed planet"> | `planet` | A ringed planet | a sphere with a tilted ring | Firefox (Mac) |
| <img src="svg/play.svg" width="72" alt="A play button"> | `play` | A play button | a raised triangle | Play (Mac) |
| <img src="svg/pointer.svg" width="72" alt="A mouse pointer"> | `pointer` | A mouse pointer | an arrow cursor | Cursor (Mac) |
| <img src="svg/presentation.svg" width="72" alt="A presentation easel"> | `presentation` | A presentation easel | a board on an easel | Keynote (Mac) |
| <img src="svg/rain-cloud.svg" width="72" alt="A rain cloud"> | `rain-cloud` | A rain cloud | a puffy cloud over three slanted drops | Weather (iPhone) |
| <img src="svg/record-button.svg" width="72" alt="A record button"> | `record-button` | A record button | a ring around a raised dot | Loom (Mac) |
| <img src="svg/rivet.svg" width="72" alt="A rivet"> | `rivet` | A rivet | a domed head on a short shaft | Rivet (Mac) |
| <img src="svg/scissors.svg" width="72" alt="Scissors"> | `scissors` | Scissors | two crossed blades with ring handles | CapCut (Mac) |
| <img src="svg/screen-mirror.svg" width="72" alt="Screen mirroring"> | `screen-mirror` | Screen mirroring | a phone standing in front of a screen | ApowerMirror (Mac) |
| <img src="svg/screen-record.svg" width="72" alt="Screen recording"> | `screen-record` | Screen recording | a screen with a record dot | Screen Studio (Mac) |
| <img src="svg/shapes.svg" width="72" alt="Basic shapes"> | `shapes` | Basic shapes | a box above a ball and a cube | Figma (Mac) |
| <img src="svg/shopping-bag.svg" width="72" alt="A shopping bag"> | `shopping-bag` | A shopping bag | a bag body with a handle loop on top | App Store (iPhone) |
| <img src="svg/sparkle.svg" width="72" alt="A sparkle"> | `sparkle` | A sparkle | a four-pointed star | Claude (Mac) |
| <img src="svg/speech-bubble.svg" width="72" alt="A speech bubble"> | `speech-bubble` | A speech bubble | a rounded bubble with a tail | Messages (iPhone) |
| <img src="svg/tv.svg" width="72" alt="A television"> | `tv` | A television | a monitor with an inset screen on a stand | TV (iPhone) |
| <img src="svg/video-camera.svg" width="72" alt="A video camera"> | `video-camera` | A video camera | a rounded body with a lens block on its side | FaceTime (iPhone), zoom.us (Mac) |
| <img src="svg/wallet.svg" width="72" alt="A wallet"> | `wallet` | A wallet | a rounded case with a card peeking out and a clasp | Wallet (iPhone) |
