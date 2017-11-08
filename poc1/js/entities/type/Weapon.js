'use strict';

/* global audioManager g_url Entity NOMINAL_UPDATE_INTERVAL spatialManager
 g_world entityManager g_asset :true */

// A generic contructor which accepts an arbitrary descriptor object /
// function Weapon(descr) {
//     for (var property in descr) {
//         this[property] = descr[property];
//     }
// }

function Weapon(descr) {
  this.setup(descr);
  this.sprite = this.sprite || g_asset.sprite.pistol;
  this.scale = 1;

  this.type = this.type;
  this.slot = this.slot;
  this.damage = this.damage;
  this.splash = this.splash || 0;
  this.ammo = this.ammo;
  this.clipSize = this.clipSize;
  this.ammoInClip = this.clipSize;
  this.reloadTime = this.reloadTime || 1;
  this.bulletSpeed = this.bulletSpeed || 15;
  this.fireRate = this.fireRate || 2;
  this.through = this.through || 0;
  this.accuracy = this.accuray || 1;
  this.pickedUp = this.pickedUp || false;
}


Weapon.prototype = new Entity();

// USP Pistol
const MACHETE = new Weapon({
  type: 'Knife',
  slot: 1,
  damage: 100,
  ammo: Math.infinity,
  clipSize: Math.infinity,
  fireRate: 2,
  pickedUp: true,
});

// USP Pistol
const USP = new Weapon({
  type: 'Pistal',
  slot: 2,
  damage: 30,
  ammo: 96,
  clipSize: 12,
  bulletSpeed: 20,
  fireRate: 2,
  accuray: 0.8,
  pickedUp: true,
});

// Leone Shotgun
const LEONE = new Weapon({
  type: 'Shotgun',
  slot: 3,
  damage: 20,
  ammo: 32,
  clipSize: 8,
  bulletSpeed: 15,
  reloadTime: 4,
  fireRate: 1.2,
  accuray: 0.5,
  pickedUp: false,
});

// AK Rifle
const AK = new Weapon({
  type: 'Rifle',
  slot: 4,
  damage: 70,
  ammo: 90,
  clipSize: 30,
  reloadTime: 2,
  bulletSpeed: 25,
  fireRate: 3,
  through: 2,
  accuray: 0.9,
  pickedUp: false,
});

// Magnum Sniper
const MAGNUM = new Weapon({
  type: 'Sniper',
  slot: 5,
  damage: 150,
  ammo: 30,
  clipSize: 10,
  reloadTime: 3,
  bulletSpeed: 35,
  fireRate: 1,
  through: 4,
  pickedUp: false,
});

// M249 Heavy Machine Gun
const M249 = new Weapon({
  type: 'MG',
  slot: 6,
  damage: 70,
  ammo: 200,
  clipSize: 100,
  reloadTime: 6,
  bulletSpeed: 20,
  fireRate: 2,
  through: 2,
  pickedUp: false,
});

// Ray Gun
const RAY = new Weapon({
  type: 'RAYGUN',
  slot: 7,
  damage: 1000,
  ammo: 10,
  clipSize: 30,
  bulletSpeed: 100,
  reloadTime: 3,
  fireRate: 3,
  pickedUp: false,
});

Weapon.prototype.fire = function () {
  console.log('FIRE ' + this.ammoInClip);

  if (this.ammoInClip > 0) {
    this.ammoInClip -= 1;
    entityManager.fireBullet(
      cx,
      cy,
      velX,
      velY,
      rotation,
    );
  } else {
    console.log('Realod!');
  }
};

Weapon.prototype.reload = function () {
  if (clipSize <= ammo) {
    this.ammo -= this.clipSize;
    this.ammoInClip -= this.clipSize;
  } else {
    this.ammoInClip -= this.ammmo;
    this.ammo = 0;
  }
};

Weapon.prototype.pickup = function () {
  this.pickedUp = true;
};
