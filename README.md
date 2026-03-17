# Charming Elisa

An interactive visual novel game created as a birthday gift for Elisa. Navigate through an engaging story with mini-games and narrative choices.

## 🎮 Features

- **Interactive Story System**: Experience a branching narrative with dialogue and character interactions
- **Mini-Games**:
  - Fruit Collection Game: Catch items to win Elisa's heart
  - Flappy Dog Game: Save Fayou from chocolate obstacles
- **Visual Polish**: Smooth animations, screen shake effects, and particle systems
- **Responsive Design**: Optimized for mobile and desktop devices

## 📁 Project Architecture

```
CharmElisa/
├── index.html                  # Entry point
├── src/
│   ├── scripts/               # Game logic modules
│   │   ├── main.js           # Application entry point
│   │   ├── story-dialogue.js  # Narrative system and story flow
│   │   ├── mini-game.js       # Fruit collection mini-game
│   │   ├── flappy-game.js     # Dog platformer mini-game
│   │   ├── effects.js         # Visual effects (shake, particles)
│   │   └── asset-loader.js    # Image asset management
│   └── assets/
│       ├── images/            # Game graphics and sprites
│       └── styles/            # CSS styling
└── Dialogs.txt               # Dialogue strings backup

```

## 🏗️ Technical Stack

- **Frontend**: Vanilla HTML5, CSS3 (ES6 Modules)
- **Rendering**: Canvas API for mini-games
- **Architecture**: Modular component-based design
- **No Dependencies**: Pure JavaScript - fully self-contained

## 📖 How It Works

### Story Flow

1. Player awakens to begin the quest
2. Uncle Noël (a mentor character) explains the mission
3. First mini-game: Collect sausages to prove worthiness
4. Second mini-game: Save Fayou the dog from chocolate
5. Story progression with multiple choice options

### Game Flow Pattern

Each game module follows this pattern:
- Initialize game state
- Set initial player/object positions
- Game loop: **update** → **draw** → **requestAnimationFrame**
- Collision detection and scoring
- Win/lose conditions trigger story progression

### Asset System

All images are centrally loaded via `asset-loader.js` to ensure consistent asset management and error handling.

## 🚀 Getting Started

1. Open `index.html` in a web browser
2. Click or tap to progress through the story
3. Complete mini-games to advance
4. Enjoy the story!

### Development

The modular structure makes it easy to extend:
- Add new mini-games by creating new `*-game.js` files
- Extend the story by adding new functions in `story-dialogue.js`
- Update visuals in `src/assets/styles/style.css`
- Add game assets to `src/assets/images/`

## 👥 Collaborators

- **Lucas VINCENT** - Game development & story design
- **Ethan FARGIER** - Code optimization & refactoring

## 📝 License

Created for personal use. All rights reserved.

---

*Made with ❤️ as a birthday surprise*
