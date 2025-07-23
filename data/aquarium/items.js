// data/aquarium/items.js

export const fishData = [
  { id: 'goldfish', name: 'Goldfish', img: '/resources/fish/fish_1.gif', color: '#FFA726', maxQuantity: 3 },
  { id: 'angelfish', name: 'Angelfish', img: '/resources/fish/fish_2.gif', color: '#FFD54F', maxQuantity: 3 },
  { id: 'clownfish', name: 'Clownfish', img: '/resources/fish/fish_3.gif', color: '#FF7043', maxQuantity: 3 },
  { id: 'blue_tang', name: 'Blue Tang', img: '/resources/fish/fish_4.gif', color: '#42A5F5', maxQuantity: 3 },
  { id: 'royal_gramma', name: 'Royal Gramma', img: '/resources/fish/fish_5.gif', color: '#AB47BC', maxQuantity: 3 },
];

export const plantData = [
  { id: 'plant1', name: 'Java Moss', img: '/resources/plants/plant_1.png', maxQuantity: 5 },
  { id: 'plant2', name: 'Amazon Sword', img: '/resources/plants/plant_2.png', maxQuantity: 3 },
  { id: 'plant3', name: 'Anubias', img: '/resources/plants/plant_3.png', maxQuantity: 4 },
  { id: 'plant4', name: 'Water Wisteria', img: '/resources/plants/plant_4.png', maxQuantity: 3 },
  { id: 'plant5', name: 'Hornwort', img: '/resources/plants/plant_5.png', maxQuantity: 4 },
  { id: 'plant6', name: 'Cryptocoryne', img: '/resources/plants/plant_6.png', maxQuantity: 3 },
  { id: 'plant7', name: 'Duckweed', img: '/resources/plants/plant_7.png', maxQuantity: 6 },
  { id: 'plant8', name: 'Bucephalandra', img: '/resources/plants/plant_8.png', maxQuantity: 4 },
  { id: 'plant9', name: 'Vallisneria', img: '/resources/plants/plant_9.png', maxQuantity: 4 },
  { id: 'plant10', name: 'Rotala', img: '/resources/plants/plant_10.png', maxQuantity: 5 },
  { id: 'plant11', name: 'Ludwigia', img: '/resources/plants/plant_11.png', maxQuantity: 3 },
  { id: 'plant12', name: 'Dwarf Hairgrass', img: '/resources/plants/plant_12.png', maxQuantity: 8 },
  { id: 'plant13', name: 'Marimo Moss Ball', img: '/resources/plants/plant_13.png', maxQuantity: 2 },
  { id: 'plant14', name: 'Red Tiger Lotus', img: '/resources/plants/plant_14.png', maxQuantity: 2 },
  { id: 'plant15', name: 'Java Fern', img: '/resources/plants/plant_15.png', maxQuantity: 3 },
  { id: 'plant_long_1', name: 'Tall Lotus', img: '/resources/plants/plant_long_1.png', maxQuantity: 2 },
  { id: 'plant_long_2', name: 'Reed Grass', img: '/resources/plants/plant_long_2.png', maxQuantity: 3 },
  { id: 'plant_long_3', name: 'Large Amazon Sword', img: '/resources/plants/plant_long_3.png', maxQuantity: 1 },
  { id: 'plant_long_4', name: 'Weeping Moss', img: '/resources/plants/plant_long_4.png', maxQuantity: 2 },
  { id: 'shell_1', name: 'Shell', img: '/resources/plants/shell_1.png', maxQuantity: 3 },
  { id: 'sponge_1', name: 'Sponge', img: '/resources/plants/sponge_1.png', maxQuantity: 2 },
];

export const availableBackgrounds = [
  { 
    id: 'default', 
    name: 'Deep Blue',
    preview: 'background: linear-gradient(to bottom, #0ea5e9, #0284c7);'
  },
  { 
    id: 'background_1a', 
    name: 'Ocean Deep',
    image: '/resources/backgrounds/background_1a.png',
    preview: 'background-image: url("/resources/backgrounds/background_1a.png"); background-size: cover;'
  },
  { 
    id: 'background_1b', 
    name: 'Ocean Medium',
    image: '/resources/backgrounds/background_1b.png',
    preview: 'background-image: url("/resources/backgrounds/background_1b.png"); background-size: cover;'
  },
  { 
    id: 'background_1c', 
    name: 'Ocean Light',
    image: '/resources/backgrounds/background_1c.png',
    preview: 'background-image: url("/resources/backgrounds/background_1c.png"); background-size: cover;'
  },
  { 
    id: 'background_2a', 
    name: 'Coral Deep',
    image: '/resources/backgrounds/background_2a.png',
    preview: 'background-image: url("/resources/backgrounds/background_2a.png"); background-size: cover;'
  },
  { 
    id: 'background_2b', 
    name: 'Coral Medium',
    image: '/resources/backgrounds/background_2b.png',
    preview: 'background-image: url("/resources/backgrounds/background_2b.png"); background-size: cover;'
  },
  { 
    id: 'background_2c', 
    name: 'Coral Light',
    image: '/resources/backgrounds/background_2c.png',
    preview: 'background-image: url("/resources/backgrounds/background_2c.png"); background-size: cover;'
  },
  { 
    id: 'background_3a', 
    name: 'Tropical Deep',
    image: '/resources/backgrounds/background_3a.png',
    preview: 'background-image: url("/resources/backgrounds/background_3a.png"); background-size: cover;'
  },
  { 
    id: 'background_3b', 
    name: 'Tropical Medium',
    image: '/resources/backgrounds/background_3b.png',
    preview: 'background-image: url("/resources/backgrounds/background_3b.png"); background-size: cover;'
  },
  { 
    id: 'background_3c', 
    name: 'Tropical Light',
    image: '/resources/backgrounds/background_3c.png',
    preview: 'background-image: url("/resources/backgrounds/background_3c.png"); background-size: cover;'
  }
];

export const availableFloors = [
  { 
    id: 'sand', 
    name: 'Sand',
    preview: 'background: linear-gradient(to top, #fbbf24, #f59e0b);'
  },
  { 
    id: 'tiles_1', 
    name: 'Blue Tiles',
    image: '/resources/floor_tiles/tiles_1.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_1.png"); background-size: cover;'
  },
  { 
    id: 'tiles_10', 
    name: 'Stone Tiles',
    image: '/resources/floor_tiles/tiles_10.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_10.png"); background-size: cover;'
  },
  { 
    id: 'tiles_10b', 
    name: 'Stone Tiles Alt',
    image: '/resources/floor_tiles/tiles_10b.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_10b.png"); background-size: cover;'
  },
  { 
    id: 'tiles_10c', 
    name: 'Stone Tiles Light',
    image: '/resources/floor_tiles/tiles_10c.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_10c.png"); background-size: cover;'
  },
  { 
    id: 'tiles_11', 
    name: 'Dark Tiles',
    image: '/resources/floor_tiles/tiles_11.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_11.png"); background-size: cover;'
  },
  { 
    id: 'tiles_11b', 
    name: 'Dark Tiles Alt',
    image: '/resources/floor_tiles/tiles_11b.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_11b.png"); background-size: cover;'
  },
  { 
    id: 'tiles_11c', 
    name: 'Dark Tiles Light',
    image: '/resources/floor_tiles/tiles_11c.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_11c.png"); background-size: cover;'
  }
];

export const availableFrames = [
  { 
    id: 'none', 
    name: 'No Frame',
    preview: 'background: transparent;'
  },
  { 
    id: 'fishtank_1', 
    name: 'Classic Frame',
    image: '/resources/fishtank_1.png',
    preview: 'background-image: url("/resources/fishtank_1.png"); background-size: contain; background-repeat: no-repeat; background-position: center;'
  },
  { 
    id: 'fishtank_2', 
    name: 'Modern Frame',
    image: '/resources/fishtank_2.png',
    preview: 'background-image: url("/resources/fishtank_2.png"); background-size: contain; background-repeat: no-repeat; background-position: center;'
  },
  { 
    id: 'fishtank_3', 
    name: 'Elegant Frame',
    image: '/resources/fishtank_3.png',
    preview: 'background-image: url("/resources/fishtank_3.png"); background-size: contain; background-repeat: no-repeat; background-position: center;'
  }
];
