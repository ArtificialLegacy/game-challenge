class Tile {
  constructor(type) {
    this.type = type;
  }
}

class Item extends Tile {
  constructor() {
    super("Item");
    this.t = floor(random(0, 2)) ? "armor" : "weapon";
    this.armor = 0;
    this.attack = 0;
    if (this.t == "armor") this.armor = floor(random(2 * (level / 2), 5 * level));
    if (this.t == "weapon") this.attack = floor(random(2 * (level / 2), 5 * level));
  }
}

class Enemy extends Tile {
  constructor() {
    super("Enemy");
    this.health = floor(random(4 * (level / 2), 9 * level));
    this.armor = floor(random(2 * (level / 2), 5 * level));
    this.attack = floor(random(2 * (level / 2), 5 * level));
  }
}

class Player extends Tile {
  constructor() {
    super("Player");
    this.health = 10;
    this.armor = 0;
    this.attack = 1;
  }
}

let world = [];
for (let i = 0; i < 10; i++) {
  world.push([]);
  for (let j = 0; j < 10; j++) {
    world[i].push(undefined);
  }
}

let playerx = 0;
let playery = 0;

let level = 1;
let kills = 0;


function setup() {
  createCanvas(400, 400);
  genRoom();
}

function draw() {
  push();
  
  background(100);
  
  stroke(255);
  fill(0);
  rect(10, 10, 200, 200);
  
  rect(10, 220, 200, 170);
  
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      
      stroke(255);
      fill(0);
      
      rect(x * 20 + 10, y * 20 + 10, 20, 20);
      
      fill(255);
      noStroke();
      textAlign(CENTER);
      textSize(8);
      
      if (world[x][y])
        switch (world[x][y].type) {
          case "Item":
            text("i", x * 20 + 20, y * 20 + 23);
          break;
          case "Enemy":
            text("e", x * 20 + 20, y * 20 + 23);
          break;
          case "Player":
            text("p", x * 20 + 20, y * 20 + 23);
          break;
        }
    }
  }
  
  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(13);
  
  text(`Health: ${world[playerx][playery].health}`, 13, 240);
  text(`Attack: ${world[playerx][playery].attack}`, 13, 255);
  text(`Armor: ${world[playerx][playery].armor}`, 13, 270);
  
  pop();
}

function keyPressed() {
  let movex = 0;
  let movey = 0;
  if (keyCode == 37) { // <
    movex = -1;
  } else if (keyCode == 38) { // /\
    movey = -1;
  } else if (keyCode == 39) { // >
    movex = 1;
  } else if (keyCode == 40) { // \/
    movey = 1;
  }
  
  let player = world[playerx][playery];
  
  world[playerx][playery] = undefined;
  
  let mvx = playerx + movex;
  let mvy = playery + movey;
  
  if (mvx >= 0 && mvx <= 9 && mvy >= 0 && mvy <= 9) {
    playerx = mvx;
    playery = mvy;
  }
  
  if (world[playerx][playery]) {
    switch(world[playerx][playery].type) {
      case "Item":
        player.attack += world[playerx][playery].attack;
        player.armor += world[playerx][playery].armor;
      break;
      case "Enemy":
        player.health -= max(0, world[playerx][playery].attack - (player.armor / 2));
        
        world[playerx][playery].health -= max(0, player.attack - (world[playerx][playery].armor / 2));
        if (world[playerx][playery].health > 0) {
          playerx -= movex;
          playery -= movey;
        } else {
          player.health += 2 * level;
          kills++;
          if (kills == 10) {
            kills = 0;
            level++;
            genRoom(player);
            return;
          }
        }
      break;
    }
  }
  
  if (player.health <= 0) {
    genRoom();
    kills = 0;
    level = 0;
    return;
  }
  
  world[playerx][playery] = player;
}

function genRoom(p = undefined) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      world[i][j] = undefined;
    }
  }
  
  for (let i = 0; i < 5; i++) {
    let x;
    let y;
    do {
      x = floor(random(0, 10));
      y = floor(random(0, 10));
    } while(world[x][y]);
    world[x][y] = new Item();
  }
  
  for (let i = 0; i < 10; i++) {
    let x;
    let y;
    do {
      x = floor(random(0, 10));
      y = floor(random(0, 10));
    } while(world[x][y]);
    world[x][y] = new Enemy();
  }
  
  let px = 0;
  let py = 0;
  
  while (world[px][py]) {
    px = floor(random(0, 10));
    py = floor(random(0, 10));
  }
  
  playerx = px;
  playery = py;
  if (p) {
    world[px][py] = p;
  } else world[px][py] = new Player();
}
