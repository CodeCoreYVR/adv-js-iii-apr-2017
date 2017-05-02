// DEMO: Property Value Shorthand

let a = 1;
let b = 2;
let c = 3;

// Let's say I want one object where the variables
// a, b and c are it's properties.

let groupingOfVars = {a: a, b: b, c: c};
// with Property Value Shorthand syntax sugar
let groupingOfVarsWithShorthand = {a, b, c};
// ☝️ returns Object {a: 1, b: 2, c: 3}
// {a, b: a, c, d: 10}

// DEMO: Objects as Modules
let dummyArr = [1,2,3,4,5,6];

const take = function take (arr, n) {
  return arr.slice(0, n);
}

const drop = function drop (arr, n) {
  return arr.slice(n);
}

const ArrayExtras = {
  // Classical syntax for defining a method
  // It is simply a function assigned as a value of a property
  last: function last (arr) { return arr[arr.length - 1] },
  // first: function first (arr) { return arr[0] },
  // 👇 is syntax sugar for writing 👆
  first (arr) { return arr[0] }, // Method shorthand syntax
  // 👇 shorthand for take: take
  take,
  drop: drop
};

// The methods last & first can used as follows:
ArrayExtras.first(dummyArr) // returns 1
ArrayExtras.last(dummyArr) // returns 6
// Because methods are just properties with functions
// as values we can also call with the [] notation
ArrayExtras['first'](dummyArr)
// When we do not use the () notation with a function value.
// the function itself is returned instead
ArrayExtras['last'] // returns function last(arr) { return arr[arr.length - 1] }

// this example

const can = {
  a: 1, b: 2, c: 3,
  // this returns the object a method belongs to
  touchThis () { return this }
  // touchThis () { return can }
};

// can.touchThis() 👈 What does it return?
// returns this which is the object itself
// assigned to can

can.touchThis() === can // returns true

// this can be used to refer to an objects on properties
can.logProps = function () { console.log(this.a, this.b, this.c) };

// DEMO: Scoping of this

const cant = {
  i: 9, j: 10, k: 11,
  touchThis: can.touchThis
}
// What does `cant.touchThis()` return?
// it will return `cant` even though touchThis() was originally
// defined as a method of `can`
// `this` is determined at the timed the function called. it will
// be the owner object of the function at that time. we name this
// "Dynamic Scoping"

let thisAlone = can.touchThis;
// What will `thisAlone()` return?
// Now that the function `touchThis` is no longer owned by an object
// (it's not a method anymore), this can't be it's previous object owner
// it will be the global object `window` in a Browser (or, the object `global` in Node)

// IIFE (Immediately Invoked Function Expression)
// (function () {...})() we get the function value inside of
// the () and then call it Immediately with the following ()
(function () {
  'use strict'
  // ☝️ special string that will force JavaScript to follow
  // its rules more strictly
  let withStrict = function () { return this };
  // Inside a function or a script where `use strict` is
  // used, this will be `undefined`. Methods will still return
  // their parent object
  console.log('Calling withStrict:', withStrict());
})();

// DEMO: Counter

/*
const counter = {
  _count: 0, // prefixing a property with `_` is an hint to users
  // of your code that it should be private
  inc() { return this._count += 1 },
  dec() { return this._count -= 1 },
  now() { return this._count },
  reset() {
    this._count = 0;
  }
}
*/

// EXERCISE: A Counter With Configurable Steps

const counter = {
  _step: 1, // considered private
  _count: 0, // prefixing a property with `_` is an hint to users
  // of your code that it should be private
  inc() { return this._count += this._step },
  dec() { return this._count -= this._step },
  now() { return this._count },
  setStep (num) { this._step = num },
  reset() {
    this._count = 0;
    this._step = 1;
  }
}

// Object.assign is core library method that takes any number of arguments
// - all arguments are Objects
// It will merge the all objects together into the first argument

let dog = {a: 1}
let cat = {b: 2}

Object.assign({}, dog, cat) // the properties of dog and cat
// are merged into the new object {}
// 👆 returns {a: 1, b: 2}

Object.assign({}, dog, cat, {a: 'vvv'})
// if some of the objects being merged share properties,
// the property of the last object will take precedence
// 👆 returns {a: "vvv", b: 2}

// the first object passed to Object.assign is mutated
// while the others are unaffected
Object.assign(dog, cat, {bark: 'woof!'})
// returns {a: 1, b: 2, bark: "woof!"}
cat // returns {b: 2}
dog // returns {a: 1, b: 2, bark: "woof!"}
// `dog` was changed but the call above

// DEMO: Constructed vs Plain
// It is convented to capitalize functions that
// are meant to be used as a constructor
function Vector (x = 0, y = 0) {
  this.x = x;
  this.y = y;
  return 'Please use me as a constructor!'
}

// usage:
let vec = new Vector(5,5);
// returns Vector {x: 5, y: 5}
// when a function is called with the `new` keyword,
// it's this will be an empty object.
// this allows to assign it properties
// the object that is return from calling a function with `new`
// will be `this`

// the object that is return from using a constructor
// can be treated like any regular javascript object

let vecA = new Vector(1,1);
let vecB = new Vector(1,1);

vecA === vecB // returns false

// You can if an object was created with a constructor of name
// by using the `instanceof` operator
vecA instanceof Vector; // returns true
vecA instanceof String; // returns false

// DEMO: Modeling Doggo Fight

/* general constructor */

/*
function Doggo (name) {
  this.name = name;
}

// You can access the shared prototype of all
// Doggo instances with the property `prototype` of
// the `Doggo` constructor

// Assign properties to Doggo.prototype will make
// all them available to all Doggo insteances
// (Doggos created with `new Doggo(...)`)
Doggo.prototype.bark = function bork () {
  return "Woofels!!!"
}

function DoggoFighter (name, specialAbility) {
  this.name = name;
  this.specialAbility = specialAbility;
}

DoggoFighter.prototype = new Doggo();

DoggoFighter.prototype.useSpecialAbility =  function () {
  return `${this.name} used ${this.specialAbility}`;
}

DoggoFighter.prototype.fight = function (doggo) {
  return `${[doggo.name, this.name][Math.floor(Math.random() * 2)]} has won!`
}

let plainPaul = new Doggo('Plain Paul');
let drillBitDarel = new DoggoFighter('Drill Bit Darel', 'Drill!');
*/


// DEMO: Refactor DoggoFighter with Classes

// the `class` keyword is syntax sugar for OOP with
// constructor functions and prototypes
class Doggo {
  constructor (name) {
    this.name = name;
  }

  // methods declared inside `class` are in fact
  // prototype methods
  bork () {
    return `Woofels!!!`
  }
}

// DoggoFighter.prototype can inherit from Doggo.prototype
// by using the `extends` keyword in the `class` declaration
// as shown below
class DoggoFighter extends Doggo {
  constructor (name, specialAbility) {
    super(name); // super calls the same named method from the extended
    // class. it must be defined before mutating `this`
    this.specialAbility =  specialAbility;
  }

  useSpecialAbility () {
    return `${this.name} used ${this.specialAbility}`;
  }

  fight (doggo) {
    return `${[doggo.name, this.name][Math.floor(Math.random() * 2)]} has won!`
  }
}

const moneybagsMichael = new DoggoFighter('Moneybags Michael', 'Make it rain!');
const drabDave = new Doggo('Drab Dave');





/* */
