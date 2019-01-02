window.onload = function() {
	
	// game definition, 320x320
	var game = new Phaser.Game(320,320,Phaser.CANVAS,"",{preload:onPreload, create:onCreate});                
	
	// constants with game elements
	var EMPTY = 0;
     var WALL = 1;
     var SPOT = 2;
     var CRATE = 3;
     var PLAYER = 4;
     // according to these values, the crate on the spot = CRATE+SPOT = 5 and the player on the spot = PLAYER+SPOT = 6
	
	// sokoban level, using hardcoded values rather than constants to save time, shame on me :) 
	var levels = [[[1, 1, 1, 1, 0, 0, 0, 0],
  [1, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 4, 2, 1, 3, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 1],
  [1, 1, 3, 0, 2, 0, 1],
  [1, 0, 0, 4, 0, 0, 1],
  [1, 0, 3, 1, 2, 0, 1],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0],
  [1, 2, 0, 1, 0, 0],
  [1, 2, 0, 1, 1, 1],
  [1, 4, 3, 0, 0, 1],
  [1, 0, 3, 0, 0, 1],
  [1, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 4, 0, 0, 1],
  [1, 0, 0, 3, 3, 0, 1],
  [1, 1, 1, 0, 2, 1, 1],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 5, 4, 1, 0],
  [1, 0, 0, 3, 2, 1, 1],
  [1, 1, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0],
  [1, 0, 0, 1, 0, 0],
  [1, 0, 4, 1, 0, 0],
  [1, 2, 3, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 2, 3, 1, 0, 1],
  [1, 1, 0, 0, 0, 1],
  [0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 1, 1, 0, 1, 1],
  [1, 0, 3, 2, 3, 2, 0, 1],
  [1, 1, 0, 1, 0, 0, 0, 1],
  [0, 1, 0, 4, 0, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 3, 2, 4, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 3, 2, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 1, 0],
  [1, 1, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 2, 1, 1],
  [1, 0, 0, 3, 3, 2, 1, 0],
  [1, 1, 0, 0, 0, 4, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 1, 0],
  [1, 1, 3, 1, 2, 1, 0],
  [1, 0, 0, 0, 0, 1, 1],
  [1, 0, 3, 1, 2, 0, 1],
  [1, 1, 0, 4, 0, 0, 1],
  [0, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 1],
  [1, 1, 3, 1, 1, 0, 0, 1],
  [1, 0, 4, 2, 1, 0, 0, 1],
  [1, 0, 3, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 0],
  [1, 2, 2, 6, 1, 0],
  [1, 0, 3, 3, 1, 1],
  [1, 1, 3, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 0, 1, 1],
  [1, 0, 3, 3, 3, 0, 1],
  [1, 0, 2, 6, 2, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0],
  [1, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 3, 2, 0, 1],
  [1, 1, 0, 5, 0, 1],
  [0, 1, 3, 2, 0, 1],
  [0, 1, 0, 4, 1, 1],
  [0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 4, 0, 0, 1],
  [1, 0, 0, 0, 3, 3, 3, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1, 1],
  [1, 2, 2, 2, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 3, 0, 0, 1],
  [1, 0, 1, 0, 6, 5, 2, 0, 1],
  [1, 0, 1, 0, 0, 3, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [1, 1, 0, 1, 0, 0, 1, 0],
  [1, 2, 5, 1, 0, 0, 1, 0],
  [1, 2, 0, 1, 0, 1, 1, 1],
  [1, 4, 3, 3, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 2, 2, 2, 1],
  [1, 0, 3, 3, 3, 0, 1],
  [1, 0, 4, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1],
  [1, 0, 2, 2, 0, 0, 1],
  [1, 0, 2, 4, 3, 0, 1],
  [1, 1, 0, 3, 3, 0, 1],
  [0, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0, 0],
  [1, 0, 4, 1, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 3, 3, 3, 0, 0, 1],
  [1, 2, 2, 2, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 6, 0, 1, 0],
  [1, 1, 1, 0, 5, 0, 1, 1],
  [1, 0, 0, 3, 5, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 3, 0, 0, 1],
  [1, 1, 3, 5, 2, 0, 1],
  [1, 0, 0, 2, 0, 1, 1],
  [1, 0, 0, 4, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 2, 1, 0, 1, 0, 1],
  [1, 0, 3, 3, 2, 0, 1],
  [1, 2, 0, 0, 1, 1, 1],
  [1, 0, 1, 3, 1, 0, 0],
  [1, 0, 0, 4, 1, 0, 0],
  [1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 2, 2, 2, 1],
  [1, 0, 3, 3, 0, 3, 1],
  [1, 4, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 4, 2, 2, 0, 1],
  [1, 0, 3, 3, 3, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 2, 1],
  [0, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0, 0],
  [1, 1, 1, 0, 0, 1, 1, 1],
  [1, 2, 0, 3, 0, 3, 0, 1],
  [1, 4, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 3, 2, 2, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1],
  [0, 1, 1, 0, 0, 1],
  [1, 1, 2, 3, 0, 1],
  [1, 0, 3, 2, 4, 1],
  [1, 0, 2, 3, 0, 1],
  [1, 0, 0, 1, 1, 1],
  [1, 0, 0, 1, 0, 0],
  [1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 3, 3, 0, 3, 0, 1],
  [0, 1, 2, 2, 0, 2, 0, 1],
  [0, 1, 0, 0, 1, 1, 1, 1],
  [0, 1, 4, 0, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 0, 0],
  [1, 1, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 1],
  [1, 0, 5, 2, 4, 0, 1],
  [1, 1, 3, 5, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 1, 0],
  [1, 1, 1, 3, 0, 1, 1],
  [1, 0, 6, 5, 2, 0, 1],
  [1, 0, 0, 3, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 1],
  [0, 1, 1, 0, 0, 0, 1],
  [0, 1, 0, 0, 1, 0, 1],
  [1, 1, 6, 3, 5, 5, 1],
  [1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [1, 0, 0, 5, 1, 1, 0, 1, 0, 0],
  [1, 1, 1, 0, 1, 0, 0, 1, 1, 1],
  [0, 0, 1, 0, 1, 2, 3, 5, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 1, 4, 1, 0, 1, 1],
  [0, 0, 1, 0, 1, 1, 1, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 0, 0, 2, 0, 1],
  [1, 4, 2, 3, 0, 3, 0, 1, 1],
  [1, 0, 1, 0, 3, 1, 0, 1, 0],
  [1, 0, 1, 1, 0, 1, 2, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 2, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 3, 3, 3, 0, 1, 0],
  [1, 1, 1, 4, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 1, 1],
  [1, 0, 3, 0, 3, 0, 1],
  [1, 0, 0, 1, 3, 4, 1],
  [1, 2, 2, 2, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 0, 0, 1, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 3, 2, 2, 0, 2, 1],
  [1, 0, 0, 1, 1, 4, 1, 1],
  [1, 0, 3, 3, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0, 0, 0],
  [1, 0, 2, 1, 0, 0, 0, 0],
  [1, 0, 2, 1, 1, 1, 1, 1],
  [1, 3, 0, 0, 3, 4, 0, 1],
  [1, 0, 0, 0, 3, 0, 0, 1],
  [1, 2, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 4, 0, 1],
  [1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 3, 3, 1, 2, 0, 1],
  [1, 2, 0, 0, 0, 0, 1, 1],
  [1, 0, 3, 0, 1, 0, 1, 0],
  [1, 1, 1, 0, 0, 2, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0],
  [1, 0, 1, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 1],
  [1, 5, 6, 3, 5, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 2, 3, 0, 1],
  [1, 0, 0, 2, 3, 4, 1],
  [1, 1, 1, 2, 3, 1, 1],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0],
  [1, 0, 0, 1, 1, 1],
  [1, 0, 3, 2, 0, 1],
  [1, 0, 0, 3, 2, 1],
  [1, 1, 3, 2, 0, 1],
  [0, 1, 4, 0, 1, 1],
  [0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 1, 1],
  [1, 0, 0, 3, 3, 3, 0, 1],
  [1, 4, 2, 2, 0, 2, 0, 1],
  [1, 1, 1, 1, 0, 0, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 2, 5, 5, 3, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 2, 2, 0, 4, 0, 1],
  [1, 0, 3, 0, 1, 1, 0, 1],
  [1, 1, 0, 0, 1, 1, 0, 1],
  [0, 1, 3, 2, 0, 3, 0, 1],
  [0, 1, 0, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [1, 1, 1, 0, 3, 1, 1, 1],
  [1, 0, 0, 3, 2, 3, 0, 1],
  [1, 0, 0, 2, 4, 2, 0, 1],
  [1, 1, 0, 0, 0, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 6, 3, 5, 5, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 2, 0, 0, 1],
  [1, 1, 3, 5, 3, 0, 1],
  [0, 1, 0, 2, 4, 1, 1],
  [0, 1, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0],
  [1, 0, 0, 1, 1, 0],
  [1, 0, 2, 4, 1, 0],
  [1, 0, 5, 0, 1, 0],
  [1, 1, 5, 0, 1, 1],
  [1, 0, 3, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 1],
  [0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 3, 5, 5, 6, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 2, 0, 1],
  [1, 1, 1, 3, 2, 0, 1],
  [1, 0, 0, 0, 2, 0, 1],
  [1, 0, 3, 3, 0, 0, 1],
  [1, 1, 0, 4, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 4, 3, 3, 0, 1],
  [1, 1, 3, 2, 2, 1],
  [0, 1, 0, 2, 0, 1],
  [0, 1, 1, 0, 0, 1],
  [0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 3, 2, 0, 1],
  [1, 0, 0, 3, 2, 1, 1],
  [1, 1, 1, 3, 2, 1, 0],
  [0, 0, 1, 4, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 4, 1, 0],
  [1, 0, 0, 5, 0, 1, 1],
  [1, 0, 0, 5, 2, 0, 1],
  [1, 0, 0, 5, 3, 0, 1],
  [1, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 4, 1, 0, 1],
  [1, 0, 0, 0, 0, 3, 0, 1],
  [1, 0, 1, 2, 2, 2, 1, 1],
  [1, 0, 3, 0, 1, 3, 1, 0],
  [1, 1, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 0, 0, 0],
  [1, 1, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 5, 3, 4, 0, 1],
  [1, 0, 0, 2, 5, 0, 0, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 4, 0, 1, 0, 0],
  [1, 1, 1, 3, 5, 1, 1, 1],
  [1, 0, 0, 5, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 1],
  [1, 1, 1, 3, 2, 1],
  [1, 0, 0, 3, 2, 1],
  [1, 0, 1, 3, 2, 1],
  [1, 0, 1, 4, 0, 1],
  [1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 0, 0],
  [1, 0, 2, 3, 2, 1, 1, 1],
  [1, 0, 0, 3, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 4, 2, 1],
  [0, 0, 1, 3, 0, 1, 1, 1],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 1],
  [1, 1, 2, 0, 0, 2, 1],
  [1, 0, 2, 0, 1, 0, 1],
  [1, 0, 0, 0, 3, 0, 1],
  [1, 0, 3, 1, 3, 1, 1],
  [1, 1, 0, 4, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 0, 0, 1],
  [1, 0, 1, 5, 1, 0, 1],
  [1, 5, 0, 3, 0, 0, 1],
  [1, 0, 0, 4, 0, 1, 1],
  [1, 0, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 0, 0],
  [1, 2, 0, 0, 1, 0, 0],
  [1, 2, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 3, 0, 1],
  [1, 0, 3, 3, 2, 0, 1],
  [1, 0, 0, 4, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 1],
  [0, 1, 1, 0, 0, 1],
  [0, 1, 4, 0, 0, 1],
  [1, 1, 3, 5, 0, 1],
  [1, 0, 5, 2, 1, 1],
  [1, 0, 0, 0, 1, 0],
  [1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0],
  [1, 0, 1, 0, 1, 1, 0],
  [1, 0, 1, 6, 0, 1, 1],
  [1, 0, 3, 5, 3, 0, 1],
  [1, 0, 0, 2, 0, 0, 1],
  [1, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 3, 2, 1, 1],
  [1, 0, 0, 3, 6, 1, 0],
  [1, 1, 1, 3, 2, 1, 0],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 2, 1, 1, 1],
  [1, 1, 1, 3, 0, 3, 0, 1],
  [1, 0, 4, 0, 3, 1, 0, 1],
  [1, 0, 1, 2, 2, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 5, 1, 0],
  [1, 0, 1, 0, 2, 1, 0],
  [1, 0, 0, 4, 3, 1, 1],
  [1, 1, 1, 0, 5, 0, 1],
  [0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 4, 0, 1, 0, 0, 0, 1],
  [1, 0, 2, 5, 5, 5, 3, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0, 1],
  [0, 1, 1, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 3, 2, 1],
  [1, 0, 0, 0, 3, 2, 1],
  [1, 0, 0, 1, 3, 2, 1],
  [1, 1, 0, 1, 0, 0, 1],
  [0, 1, 0, 0, 4, 0, 1],
  [0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 1],
  [0, 1, 3, 0, 0, 0, 1],
  [0, 1, 4, 3, 2, 0, 1],
  [1, 1, 3, 1, 2, 1, 1],
  [1, 0, 0, 0, 2, 1, 0],
  [1, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 0],
  [1, 1, 0, 3, 0, 1, 0],
  [1, 0, 2, 3, 2, 1, 1],
  [1, 0, 0, 3, 2, 0, 1],
  [1, 1, 1, 4, 0, 0, 1],
  [0, 0, 1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 0, 0],
  [1, 0, 2, 0, 1, 1, 1],
  [1, 0, 2, 0, 3, 0, 1],
  [1, 0, 4, 0, 2, 0, 1],
  [1, 1, 0, 1, 2, 1, 1],
  [0, 1, 0, 3, 0, 0, 1],
  [0, 1, 1, 3, 3, 0, 1],
  [0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 0, 1],
  [1, 1, 0, 4, 0, 0, 0, 1],
  [1, 0, 5, 5, 5, 2, 0, 1],
  [1, 0, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 3, 3, 5, 0, 0, 1],
  [1, 0, 2, 4, 2, 0, 1, 1],
  [1, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 2, 4, 2, 0, 1],
  [1, 0, 0, 3, 2, 1, 0, 1],
  [1, 0, 0, 0, 3, 0, 0, 1],
  [1, 1, 1, 1, 0, 3, 1, 1],
  [0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 0, 1, 0],
  [1, 4, 0, 1, 0, 0, 1, 0],
  [1, 2, 3, 5, 3, 2, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 0, 1],
  [0, 1, 0, 1, 1, 1, 0, 1],
  [0, 1, 0, 0, 0, 0, 0, 1],
  [0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 2, 0, 1, 0, 0],
  [1, 1, 4, 0, 3, 1, 1, 1],
  [1, 0, 0, 5, 0, 0, 0, 1],
  [1, 0, 5, 0, 5, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 1, 0],
  [1, 1, 3, 1, 0, 1, 0],
  [1, 0, 4, 0, 0, 1, 0],
  [1, 0, 1, 0, 2, 1, 1],
  [1, 2, 3, 3, 2, 0, 1],
  [1, 1, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0]],
 [[1, 1, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 2, 0, 3, 2, 0, 1],
  [1, 1, 1, 3, 5, 3, 0, 1],
  [0, 0, 1, 0, 2, 0, 1, 1],
  [0, 0, 1, 1, 4, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 3, 1, 1, 2, 1, 0],
  [1, 1, 0, 1, 1, 2, 1, 1],
  [1, 0, 0, 0, 3, 2, 0, 1],
  [1, 0, 3, 0, 0, 4, 0, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 [[0, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 1],
  [0, 1, 0, 5, 3, 4, 1],
  [1, 1, 0, 5, 2, 0, 1],
  [1, 0, 0, 5, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]]];

    var levelIndex = 0;
    var level = levels[levelIndex];

	var tile_keys = [31,24,55,36,128,38,128]

	
	// array which will keep track of undos
	var undoArray = [];
	
	// array which will contain all crates
	var crates = [];
	
	// size of a tile, in pixels
     var tileSize = 32;
     
     // the player! Yeah!
     var player;
     
     // is the player moving?
     var playerMoving = false;
     
     // variables used to detect and manage swipes
     var startX;
     var startY;
     var endX;
     var endY;
     
     // Variables used to create groups. The fist group is called fixedGroup, it will contain
     // all non-moveable elements (everything but crates and player).
     // Then we add movingGroup which will contain moveable elements (crates and player)
     var fixedGroup;
     var movingGroup;

     // first function to be called, when the game preloads I am loading the sprite sheet with all game tiles
	function onPreload() {
		//game.load.spritesheet("tiles","tiles.png",40,40);
		game.load.spritesheet("tiles","tiny.png",32,32)
	}

	// function to scale up the game to full screen
	function goFullScreen(){
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setScreenSize(true);
	}

	// function to be called when the game has been created
	function onCreate() {
		// waiting for a key pressed
		game.input.keyboard.addCallbacks(this,onDown);
		// going full screen with the function defined at line 32
		goFullScreen();
		// drawing the level
          drawLevel();
		// once the level has been created, we wait for the player to touch or click, then we call
		// beginSwipe function
		game.input.onDown.add(beginSwipe, this);		
	}
	
	function drawLevel(){  
          // empty crates array. Don't use crates = [] or it could mess with pointers
          crates.length = 0;      
		// adding the two groups to the game
          fixedGroup = game.add.group();
          movingGroup = game.add.group();
          // variable used for tile creation
          var tile
          // looping trough all level rows
		for(var i=0;i<level.length;i++){
			// creation of 2nd dimension of crates array
               crates[i]= [];
               // looping through all level columns
			for(var j=0;j<level[i].length;j++){
				// by default, there are no crates at current level position, so we set to null its
				// array entry
                    crates[i][j] = null;
                    // what do we have at row j, col i?
                tile = game.add.sprite(32*j,32*i,"tiles");
				tile.frame = tile_keys[0];
				fixedGroup.add(tile);


				if (level[i][j]==SPOT || level[i][j]==PLAYER+SPOT || level[i][j]==CRATE+SPOT){
					spot = game.add.sprite(32*j,32*i,"tiles");
					spot.frame = tile_keys[2];
					fixedGroup.add(spot);
				}
				if (level[i][j]==PLAYER || level[i][j]==PLAYER+SPOT){
					player = game.add.sprite(32*j,32*i,"tiles");
                    // assigning the player the proper frame
			        player.frame = tile_keys[4];

                    player.animations.add('left', [145,146,144], 10, false);
                    player.animations.add('right', [161,162,160], 10, false);
                    player.animations.add('up', [177,178,176], 10, false);
                    player.animations.add('down', [129,130,128], 10, false);

                    // creation of two custom attributes to store player x and y position
                    player.posX = j;
                    player.posY = i;
                    // adding the player to movingGroup
                    movingGroup.add(player);
				}
				if (level[i][j]==CRATE || level[i][j]==CRATE+SPOT){
					// crate creation, both as a sprite and as a crates array item
                    crates[i][j] = game.add.sprite(32*j,32*i,"tiles");
                    // assigning the crate the proper frame
                    crates[i][j].frame = tile_keys[level[i][j]];
                    // adding the crate to movingGroup
                    movingGroup.add(crates[i][j]);
				}
				if (level[i][j]==WALL){
					tile = game.add.sprite(32*j,32*i,"tiles");
				    tile.frame = tile_keys[1];
                    fixedGroup.add(tile);
				}



				
			}
		}
	}
	
	function playAnimation(deltaX,deltaY){
		var direction;
		if (deltaX==-1 && deltaY==0) {direction = 'left'; frameIndex=144};
		if (deltaX==0 && deltaY==-1) {direction = 'up'; frameIndex=176};
		if (deltaX==1 && deltaY==0) {direction = 'right'; frameIndex=160};
		if (deltaX==0 && deltaY==1) {direction = 'down'; frameIndex=128};
		player.animations.play(direction);
		player.frame = frameIndex;
	}

    function levelCompleted(){
    	for(var i=0;i<level.length;i++){
			for(var j=0;j<level[i].length;j++){
				if (level[i][j]==SPOT || level[i][j]==SPOT+PLAYER) {
					return false;
				}
			}
		}
		return true;
     }

	// function to be executed once a key is down
	function onDown(e){
		// if the player is not moving...
		if(!playerMoving){
			switch(e.keyCode){
				// left
				case 37:
					//player.animations.play('left');
					move(-1,0);
					//player.animations.stop();
					//player.frame = 144;
					break;
				// up
				case 38:
				    //player.animations.play('up');
					move(0,-1);
					//player.animations.stop();
					//player.frame = 176;
					break;
				// right
				case 39:
				    //player.animations.play('right');
					move(1,0);
					//player.animations.stop();
					//player.frame = 160;
					break;
				// down
				case 40:
				    //player.animations.play('down');
					move(0,1);
					//player.animations.stop();
					//player.frame = 128;
					break;
				
				case 82: //restart
				case 85: // undo
					var undoLevel;
					if(undoArray.length>0){
						// then undo! and remove the latest move from undoArray
						if (e.keyCode==85) undoLevel = undoArray.pop();
					
						else {
							undoLevel = undoArray[0];
							undoArray = [];
						}
						fixedGroup.destroy();
     					movingGroup.destroy();
     					level = [];
     					level = copyArray(undoLevel);
     					drawLevel();
					}
					break;
				case 86:
				    movePlayerPath(["uuur"],0);
				    break;
			}
		}
	}
	
	// when the player begins to swipe we only save mouse/finger coordinates, remove the touch/click
	// input listener and add a new listener to be fired when the mouse/finger has been released,
	// then we call endSwipe function
	function beginSwipe(){
		startX = game.input.worldX;
		startY = game.input.worldY;
		game.input.onDown.remove(beginSwipe);
     	game.input.onUp.add(endSwipe);
	}
	
	// function to be called when the player releases the mouse/finger
	function endSwipe(){
		// saving mouse/finger coordinates
		endX = game.input.worldX;
		endY = game.input.worldY;
		// determining x and y distance travelled by mouse/finger from the start
		// of the swipe until the end
		var distX = startX-endX;
		var distY = startY-endY;
		// in order to have an horizontal swipe, we need that x distance is at least twice the y distance
		// and the amount of horizontal distance is at least 10 pixels
		if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX)>10){
			// moving left, calling move function with horizontal and vertical tiles to move as arguments
			if(distX>0){
                    move(-1,0);
               }
               // moving right, calling move function with horizontal and vertical tiles to move as arguments
               else{
                    move(1,0);
               }
		}
		// in order to have a vertical swipe, we need that y distance is at least twice the x distance
		// and the amount of vertical distance is at least 10 pixels
		if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY)>10){
			// moving up, calling move function with horizontal and vertical tiles to move as arguments
			if(distY>0){
                    move(0,-1);
               }
               // moving down, calling move function with horizontal and vertical tiles to move as arguments
               else{
                    move(0,1);
               }
		}


		// stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
		game.input.onDown.add(beginSwipe);
     	game.input.onUp.remove(endSwipe);
     	if (Math.abs(distX)<=10 && Math.abs(distY)<=10)
     		justClick(endX,endY);
	}


	 function justClick(x,y){
	 	x = Math.floor(x/32);
	 	y = Math.floor(y/32);
	 	playerPath = findPathTo(x,y);
	 	movePlayerPath(playerPath,0);

	 }
     
     // function to move the player
     function move(deltaX,deltaY){
     	 playAnimation(deltaX,deltaY);
     	// if destination tile is walkable...
          if(isWalkable(player.posX+deltaX,player.posY+deltaY)){
          	// push current situation in the undo array
			//undoArray.push(copyArray(level));
               // then move the player and exit the function
			movePlayer(deltaX,deltaY);
			return;
          }
          // if the destination tile is a crate... 
          if(isCrate(player.posX+deltaX,player.posY+deltaY)){
          	// ...if  after the create there's a walkable tils...
               if(isWalkable(player.posX+2*deltaX,player.posY+2*deltaY)){
               	// push current situation in the undo array
				undoArray.push(copyArray(level));
				// move the crate
                    moveCrate(deltaX,deltaY);			  
                    // move the player	
				movePlayer(deltaX,deltaY);
               }
          }
          if (levelCompleted()){
          	undoArray = [];
			fixedGroup.destroy();
     		movingGroup.destroy();
     		levelIndex++;
     		level = levels[levelIndex];
     		drawLevel();
          }
     }
     
     // a tile is walkable when it's an empty tile or a spot tile
     function isWalkable(posX,posY){
		return level[posY][posX] == EMPTY || level[posY][posX] == SPOT;
	}
	
	// a tile is a crate when it's a... guess what? crate, or it's a crate on its spot
	function isCrate(posX,posY){
		return level[posY][posX] == CRATE || level[posY][posX] == CRATE+SPOT;
	}
	
	// function to move the player
	function movePlayer(deltaX,deltaY){
		// now the player is moving
		playerMoving = true;
		// moving with a 1/10s tween
		var playerTween =game.add.tween(player);
		playerTween.to({
			x:player.x+deltaX*tileSize,
			y:player.y + deltaY*tileSize
		}, 100, Phaser.Easing.Linear.None,true);
		// setting a tween callback 
		playerTween.onComplete.add(function(){
			// now the player is not moving anymore
			playerMoving = false;
		}, this);
		// updating player old position in level array   
          level[player.posY][player.posX]-=PLAYER;  
          // updating player custom posX and posY attributes
          player.posX+=deltaX;
          player.posY+=deltaY;
          // updating player new position in level array 
          level[player.posY][player.posX]+=PLAYER;  
		// changing player frame accordingly  
          //player.frame = tile_keys[level[player.posY][player.posX]];
	}

    function movePlayerPath(path,start) {
    	if (start == path.length) return;
        if(playerMoving == true) {
           window.setTimeout(function(){movePlayerPath(path,start);}, 100);
        } 
        else {
            	switch(path[start]){
					case 'u':
					    move(0,-1);
					    break;
					case 'd':
					    move(0,1);
					    break;
					case 'l':
					    move(-1,0);
					    break;
					case 'r':
					    move(1,0);
					    break;
				}
		movePlayerPath(path,start+1);
        }
    }


    function findPathTo(x,y){
    	var playerPath = [];
    	var easystar = new EasyStar.js();
    	easystar.enableSync();
        easystar.setGrid(level);
        easystar.setAcceptableTiles([0,2]);
    	easystar.findPath(player.posX, player.posY, x, y, function( path ) {
    		if (path) {
	    		for (var i = 1; i < path.length; i++){
	    			var deltaX = path[i].x-path[i-1].x;
	    			var deltaY = path[i].y-path[i-1].y;
	    			if (deltaX==-1 && deltaY==0) playerPath.push('l');
	    			if (deltaX==1 && deltaY==0) playerPath.push('r');
	    			if (deltaX==0 && deltaY==-1) playerPath.push('u');
	    			if (deltaX==0 && deltaY==1) playerPath.push('d');
	    		}
	    	}
	    	
	    });
	    easystar.calculate();
	    return playerPath;
    }


	
	// function to move the crate
	function moveCrate(deltaX,deltaY){
		// moving with a 1/10s tween
		var crateTween =game.add.tween(crates[player.posY+deltaY][player.posX+deltaX]);
		crateTween.to({
			x:crates[player.posY+deltaY][player.posX+deltaX].x+deltaX*tileSize,
			y:crates[player.posY+deltaY][player.posX+deltaX].y+deltaY*tileSize,
		}, 100, Phaser.Easing.Linear.None,true);
		// updating crates array   
          crates[player.posY+2*deltaY][player.posX+2*deltaX]=crates[player.posY+deltaY][player.posX+deltaX];
          crates[player.posY+deltaY][player.posX+deltaX]=null;
          // updating crate old position in level array  
          level[player.posY+deltaY][player.posX+deltaX]-=CRATE;
          // updating crate new position in level array  
     	level[player.posY+2*deltaY][player.posX+2*deltaX]+=CRATE;
     	// changing crate frame accordingly  
     	crates[player.posY+2*deltaY][player.posX+2*deltaX].frame=tile_keys[level[player.posY+2*deltaY][player.posX+2*deltaX]];
	}
	
	// need a recursive function to copy arrays, no need to reinvent the wheel so I got it here
	// http://stackoverflow.com/questions/10941695/copy-an-arbitrary-n-dimensional-array-in-javascript 
	function copyArray(a){
		var newArray = a.slice(0);
    		for(var i = newArray.length; i>0; i--){
			if(newArray[i] instanceof Array){
				newArray[i] = copyArray(newArray[i]);	
			}
		}
		return newArray;
	}
}