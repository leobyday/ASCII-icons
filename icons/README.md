# The icons

Every icon in this set is defined by the same spec, the one the [skill](../skills/ascii-3d-icons/SKILL.md#the-icon-spec) uses to make new ones. Two lines change per icon; the rest is fixed.

```
Subject   what the icon depicts: a generic object (the shared set has no logos: they're trademarks)
Reads as  the two or three parts that carry the shape
Style     fixed: 3D model, 9-character ramp .:-=+*#%@, @ outlines, light from the upper left,
          resting view -0.35 rad turn / 0.22 rad tilt, ink #141414 on #F3F2EE,
          JetBrains Mono Bold, raised keycap tile
Treatment 3d (50 x 30 characters, the default) or character (26 x 15)
Motion    fixed: still, or turning on its own vertical axis (one eased turn every 4.4 s)
```

So a file here is exactly: that subject, built from those parts, in that style. Want one that isn't here? Fill in the two lines and ask the skill.

## Files

Two treatments of the same models: [`3d/`](3d) (50 × 30 characters, the shading reads as form) and [`character/`](character) (26 × 15 bigger characters). Each has:

| Folder | Format |
| --- | --- |
| `svg/` | Every icon, 1024 px keycap tile, characters as editable text |
| `ios/` | iPhone app icons, 1024 px PNG, named by app |
| `macos/` | Mac app icons, 1024 px PNG, named by app |

[`wallpapers/`](wallpapers) has the Mac (3456 × 2234) and iPhone (1179 × 2556) wallpapers.

## Catalog

48 icons. Generated from `src/catalog.json` by `node scripts/catalog.js`.

| 3D forward | Character forward | Model | Subject | Reads as | Used for |
| --- | --- | --- | --- | --- | --- |
| <img src="3d/svg/bar-chart.svg" width="72" alt="A bar chart, 3D forward"> | <img src="character/svg/bar-chart.svg" width="72" alt="A bar chart, character forward"> | `bar-chart` | A bar chart | bars of rising height on a base | Numbers (Mac) |
| <img src="3d/svg/bouncing-balls.svg" width="72" alt="Bouncing balls, 3D forward"> | <img src="character/svg/bouncing-balls.svg" width="72" alt="Bouncing balls, character forward"> | `bouncing-balls` | Bouncing balls | three balls at different heights over a floor | Cavalry (Mac) |
| <img src="3d/svg/butterfly.svg" width="72" alt="A butterfly, 3D forward"> | <img src="character/svg/butterfly.svg" width="72" alt="A butterfly, character forward"> | `butterfly` | A butterfly | four separate wings, a body and two antennae | Symmetry (Mac) |
| <img src="3d/svg/calendar.svg" width="72" alt="A desk calendar, 3D forward"> | <img src="character/svg/calendar.svg" width="72" alt="A desk calendar, character forward"> | `calendar` | A desk calendar | a page with two binding rings on top | Calendar (iPhone) |
| <img src="3d/svg/camera.svg" width="72" alt="A photo camera, 3D forward"> | <img src="character/svg/camera.svg" width="72" alt="A photo camera, character forward"> | `camera` | A photo camera | a box body, a raised lens and a viewfinder bump | Camera (iPhone) |
| <img src="3d/svg/checklist.svg" width="72" alt="A checklist, 3D forward"> | <img src="character/svg/checklist.svg" width="72" alt="A checklist, character forward"> | `checklist` | A checklist | three bullets beside three lines | Reminders (iPhone) |
| <img src="3d/svg/chip.svg" width="72" alt="A computer chip, 3D forward"> | <img src="character/svg/chip.svg" width="72" alt="A computer chip, character forward"> | `chip` | A computer chip | a square die with pins on every side | Ollama (Mac) |
| <img src="3d/svg/clapperboard.svg" width="72" alt="A film clapperboard, 3D forward"> | <img src="character/svg/clapperboard.svg" width="72" alt="A film clapperboard, character forward"> | `clapperboard` | A film clapperboard | a slate with a striped hinged top | iMovie (Mac) |
| <img src="3d/svg/clock.svg" width="72" alt="A wall clock, 3D forward"> | <img src="character/svg/clock.svg" width="72" alt="A wall clock, character forward"> | `clock` | A wall clock | a round face with a rim and two hands | Clock (iPhone) |
| <img src="3d/svg/code-brackets.svg" width="72" alt="Code brackets, 3D forward"> | <img src="character/svg/code-brackets.svg" width="72" alt="Code brackets, character forward"> | `code-brackets` | Code brackets | angle brackets around a slash | Visual Studio Code (Mac) |
| <img src="3d/svg/containers.svg" width="72" alt="Shipping containers, 3D forward"> | <img src="character/svg/containers.svg" width="72" alt="Shipping containers, character forward"> | `containers` | Shipping containers | stacked boxes | Docker (Mac) |
| <img src="3d/svg/flower.svg" width="72" alt="A flower, 3D forward"> | <img src="character/svg/flower.svg" width="72" alt="A flower, character forward"> | `flower` | A flower | six round petals around a center | Photos (iPhone) |
| <img src="3d/svg/gamepad.svg" width="72" alt="A game controller, 3D forward"> | <img src="character/svg/gamepad.svg" width="72" alt="A game controller, character forward"> | `gamepad` | A game controller | a rounded controller with two grips | Discord (Mac) |
| <img src="3d/svg/gear.svg" width="72" alt="A gear, 3D forward"> | <img src="character/svg/gear.svg" width="72" alt="A gear, character forward"> | `gear` | A gear | a toothed wheel with a hole in the middle | Settings (iPhone) |
| <img src="3d/svg/git-branch.svg" width="72" alt="A branch diagram, 3D forward"> | <img src="character/svg/git-branch.svg" width="72" alt="A branch diagram, character forward"> | `git-branch` | A branch diagram | two ring nodes on a main line, with an arc curving off to a third | GitHub Desktop (Mac) |
| <img src="3d/svg/globe.svg" width="72" alt="A globe, 3D forward"> | <img src="character/svg/globe.svg" width="72" alt="A globe, character forward"> | `globe` | A globe | a sphere with an equator and meridian bands | Chrome (iPhone), Google Chrome (Mac) |
| <img src="3d/svg/handheld-console.svg" width="72" alt="A handheld game console, 3D forward"> | <img src="character/svg/handheld-console.svg" width="72" alt="A handheld game console, character forward"> | `handheld-console` | A handheld game console | one rounded body with a screen, a cross pad and two buttons | Switch Console (Mac) |
| <img src="3d/svg/handset.svg" width="72" alt="A telephone handset, 3D forward"> | <img src="character/svg/handset.svg" width="72" alt="A telephone handset, character forward"> | `handset` | A telephone handset | an arched handle between two cups | Phone (iPhone) |
| <img src="3d/svg/hash.svg" width="72" alt="A hash sign, 3D forward"> | <img src="character/svg/hash.svg" width="72" alt="A hash sign, character forward"> | `hash` | A hash sign | two crossing pairs of bars | Slack (Mac) |
| <img src="3d/svg/headphones.svg" width="72" alt="Headphones, 3D forward"> | <img src="character/svg/headphones.svg" width="72" alt="Headphones, character forward"> | `headphones` | Headphones | a headband arching over two ear cups | Spotify (Mac) |
| <img src="3d/svg/joystick.svg" width="72" alt="A joystick, 3D forward"> | <img src="character/svg/joystick.svg" width="72" alt="A joystick, character forward"> | `joystick` | A joystick | a ball-top stick on a wide base | Arcade (Mac) |
| <img src="3d/svg/keyframe.svg" width="72" alt="A keyframe diamond, 3D forward"> | <img src="character/svg/keyframe.svg" width="72" alt="A keyframe diamond, character forward"> | `keyframe` | A keyframe diamond | a diamond | Rive (Mac) |
| <img src="3d/svg/layers.svg" width="72" alt="Stacked layers, 3D forward"> | <img src="character/svg/layers.svg" width="72" alt="Stacked layers, character forward"> | `layers` | Stacked layers | offset flat sheets | Framer (Mac) |
| <img src="3d/svg/microphone.svg" width="72" alt="A microphone, 3D forward"> | <img src="character/svg/microphone.svg" width="72" alt="A microphone, character forward"> | `microphone` | A microphone | a capsule head on a stand | Wispr Flow (Mac) |
| <img src="3d/svg/music-notes.svg" width="72" alt="Music notes, 3D forward"> | <img src="character/svg/music-notes.svg" width="72" alt="Music notes, character forward"> | `music-notes` | Music notes | two note heads joined by a beam | Music (iPhone) |
| <img src="3d/svg/note-tile.svg" width="72" alt="A note pad tile, 3D forward"> | <img src="character/svg/note-tile.svg" width="72" alt="A note pad tile, character forward"> | `note-tile` | A note pad tile | a square tile with a dotted rule and two ruled lines |  |
| <img src="3d/svg/notepad.svg" width="72" alt="A notepad, 3D forward"> | <img src="character/svg/notepad.svg" width="72" alt="A notepad, character forward"> | `notepad` | A notepad | a page with ruled lines and a bound top | Notes (iPhone) |
| <img src="3d/svg/paper-plane.svg" width="72" alt="A paper plane, 3D forward"> | <img src="character/svg/paper-plane.svg" width="72" alt="A paper plane, character forward"> | `paper-plane` | A paper plane | a folded dart with a center crease | Telegram (Mac) |
| <img src="3d/svg/paper-stack.svg" width="72" alt="A stack of paper, 3D forward"> | <img src="character/svg/paper-stack.svg" width="72" alt="A stack of paper, character forward"> | `paper-stack` | A stack of paper | a few fanned sheets | Paper (Mac) |
| <img src="3d/svg/pencil.svg" width="72" alt="A pencil, 3D forward"> | <img src="character/svg/pencil.svg" width="72" alt="A pencil, character forward"> | `pencil` | A pencil | a long hexagonal body with a sharpened tip | Pen (Mac) |
| <img src="3d/svg/phone-mockup.svg" width="72" alt="A phone, 3D forward"> | <img src="character/svg/phone-mockup.svg" width="72" alt="A phone, character forward"> | `phone-mockup` | A phone | a tall rounded frame around a screen with a grid of app tiles and a speaker slot | Rotato (Mac) |
| <img src="3d/svg/planet.svg" width="72" alt="A ringed planet, 3D forward"> | <img src="character/svg/planet.svg" width="72" alt="A ringed planet, character forward"> | `planet` | A ringed planet | a sphere with a tilted ring | Firefox (Mac) |
| <img src="3d/svg/play.svg" width="72" alt="A play button, 3D forward"> | <img src="character/svg/play.svg" width="72" alt="A play button, character forward"> | `play` | A play button | a raised triangle | Play (Mac) |
| <img src="3d/svg/pointer.svg" width="72" alt="A mouse pointer, 3D forward"> | <img src="character/svg/pointer.svg" width="72" alt="A mouse pointer, character forward"> | `pointer` | A mouse pointer | an arrow cursor | Cursor (Mac) |
| <img src="3d/svg/presentation.svg" width="72" alt="A presentation easel, 3D forward"> | <img src="character/svg/presentation.svg" width="72" alt="A presentation easel, character forward"> | `presentation` | A presentation easel | a board on an easel | Keynote (Mac) |
| <img src="3d/svg/rain-cloud.svg" width="72" alt="A rain cloud, 3D forward"> | <img src="character/svg/rain-cloud.svg" width="72" alt="A rain cloud, character forward"> | `rain-cloud` | A rain cloud | a puffy cloud over three slanted drops | Weather (iPhone) |
| <img src="3d/svg/record-button.svg" width="72" alt="A record button, 3D forward"> | <img src="character/svg/record-button.svg" width="72" alt="A record button, character forward"> | `record-button` | A record button | a ring around a raised dot | Loom (Mac) |
| <img src="3d/svg/rivet.svg" width="72" alt="A rivet, 3D forward"> | <img src="character/svg/rivet.svg" width="72" alt="A rivet, character forward"> | `rivet` | A rivet | a domed head on a short shaft | Rivet (Mac) |
| <img src="3d/svg/scissors.svg" width="72" alt="Scissors, 3D forward"> | <img src="character/svg/scissors.svg" width="72" alt="Scissors, character forward"> | `scissors` | Scissors | two crossed blades with ring handles | CapCut (Mac) |
| <img src="3d/svg/screen-mirror.svg" width="72" alt="Screen mirroring, 3D forward"> | <img src="character/svg/screen-mirror.svg" width="72" alt="Screen mirroring, character forward"> | `screen-mirror` | Screen mirroring | a phone standing in front of a screen | ApowerMirror (Mac) |
| <img src="3d/svg/screen-record.svg" width="72" alt="Screen recording, 3D forward"> | <img src="character/svg/screen-record.svg" width="72" alt="Screen recording, character forward"> | `screen-record` | Screen recording | a screen with a record dot | Screen Studio (Mac) |
| <img src="3d/svg/shapes.svg" width="72" alt="Basic shapes, 3D forward"> | <img src="character/svg/shapes.svg" width="72" alt="Basic shapes, character forward"> | `shapes` | Basic shapes | a box above a ball and a cube | Figma (Mac) |
| <img src="3d/svg/shopping-bag.svg" width="72" alt="A shopping bag, 3D forward"> | <img src="character/svg/shopping-bag.svg" width="72" alt="A shopping bag, character forward"> | `shopping-bag` | A shopping bag | a bag body with a handle loop on top | App Store (iPhone) |
| <img src="3d/svg/sparkle.svg" width="72" alt="A sparkle, 3D forward"> | <img src="character/svg/sparkle.svg" width="72" alt="A sparkle, character forward"> | `sparkle` | A sparkle | a four-pointed star | Claude (Mac) |
| <img src="3d/svg/speech-bubble.svg" width="72" alt="A speech bubble, 3D forward"> | <img src="character/svg/speech-bubble.svg" width="72" alt="A speech bubble, character forward"> | `speech-bubble` | A speech bubble | a rounded bubble with a tail | Messages (iPhone) |
| <img src="3d/svg/tv.svg" width="72" alt="A television, 3D forward"> | <img src="character/svg/tv.svg" width="72" alt="A television, character forward"> | `tv` | A television | a monitor with an inset screen on a stand | TV (iPhone) |
| <img src="3d/svg/video-camera.svg" width="72" alt="A video camera, 3D forward"> | <img src="character/svg/video-camera.svg" width="72" alt="A video camera, character forward"> | `video-camera` | A video camera | a rounded body with a lens block on its side | FaceTime (iPhone), zoom.us (Mac) |
| <img src="3d/svg/wallet.svg" width="72" alt="A wallet, 3D forward"> | <img src="character/svg/wallet.svg" width="72" alt="A wallet, character forward"> | `wallet` | A wallet | a rounded case with a card peeking out and a clasp | Wallet (iPhone) |
