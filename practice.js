// title:  test
// author: _gav
// desc:   just remembering how tic80 works
// script: js

var _key_space = 48; // space
var _key_s = 19; // a
var _key_left = 60; // LEFT
var _key_right = 61; // RIGHT

var running = true;
var state = 'menu';

// window 240x136
// sprites are 8x8

var win_width = 240;
var win_height = 136;

var _alpha_color = 15;

var _ground_speed = 1.5; // pixels per frame the obstacles and ground moves

// laters bottom/mid/top are 0,1,2
// var OBSTACLES = [
// 	{
// 		name:'cactus',
// 		layer:0
// 		// sprite_id:
// 	}
// ]

// returns true if the bounding boxes overlap
function bbox_overlaps(x1,y1,w1,h1,x2,y2,w2,h2){
	var x1_high = x1 + w1;
	var y1_high = y1 + h1;
	var x2_high = x2 + w2;
	var y2_high = y2 + h2;
	return (x1 < x2_high && x2 < x1_high && y1 < y2_high && y2 < y1_high)
}

function create_obstacle_manager(){

	this.current_obstacles = [];

	this.spawn_obstacle = function(obstacle_id){

		//TODO define collision

		var new_obs = {
			name:'cactus',
			spr_id:288,
			resting_y: win_height - (8*4) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 4,
			spr_h: 4,
			spr_scale:1
		}

		new_obs.y = new_obs.resting_y;
		new_obs.x = win_width;

		this.current_obstacles.push(new_obs);

	}

	this.aupdate = function(){
		for (var i = this.current_obstacles.length - 1; i >= 0; i--) {
			this.current_obstacles[i].x-= _ground_speed;
			// if this obstacle is now more than 32 pixels off the left, remove it
			if(this.current_obstacles[i].x  < -32){
				this.current_obstacles.splice(i,1);
			}
		}
	}

	this.adraw = function(){
		// draw these obstacles
		for (var i = this.current_obstacles.length - 1; i >= 0; i--) {
			var this_ob = this.current_obstacles[i];

			spr(
				this_ob.spr_id,
				this_ob.x,
				this_ob.y,
				_alpha_color,
				this_ob.spr_scale,
				0,
				0,
				this_ob.spr_w,
				this_ob.spr_h
			);
		}

	}

	// this.obstacle_settings = [
	// 	{
	// 		name:'cactus',
	// 		spr_id:288,
	// 		resting_y: win_height-(8*4),
	// 		spr_width: 4,
	// 		spr_height: 4,
	// 		spr_scale:1
	// 	}

	// 	//spr(288,100,100,_alpha_color,1,0,0,4,4);
	// ];

	return this;

}
var obstacle_manager = false;

function create_player() {
	this.sprite_id = 256;
	this.sprite_w = 2;
	this.sprite_h = 2;
	this.opaque_col = 15;

	// collision is relative to the sprites position (ie, top left of the sprite) not the screen
	this.collision_x = 2;
	this.collision_y = 7;
	this.collision_w = 11;
	this.collision_h = 7;

	this.x = 10;
	this.y = win_height-(8*4);
	this.resting_y = win_height-(8*4) + 3;
	this.is_jumping = false;
	this.is_falling = false;
	
	this.jump_force = -7;
	this.y_velocity = 0;
	this.y_gravity = -50;
	this.fall_speed = 0.5;
	this.x_speed = 3;
	
	this.onGround = function(){
		// return true if y pos is at
		// 'resting' height
		return (this.y >= this.resting_y)
	}
	
	this.move = function(){
		if(key(_key_space)){
			this.jump();
		}
		if(key(_key_left)){
			this.x-= this.x_speed;
		}
		if(key(_key_right)){
			this.x+= this.x_speed;
		}
	}

	this.check_collisions = function(){
		//get player collision box
		var actual_colx = this.collision_x + this.x;
		var actual_coly = this.collision_y + this.y;

		// for each obstacle
		for (var i = obstacle_manager.current_obstacles.length - 1; i >= 0; i--) {
			var this_obstacle = obstacle_manager.current_obstacles[i];

			var actual_ob_colx = this_obstacle.collision_x + this_obstacle.x;
			var actual_ob_coly = this_obstacle.collision_y + this_obstacle.y;

			var x1 = actual_colx;
			var y1 = actual_coly;
			var w1 = this.collision_w;
			var h1 = this.collision_h;
			var x2 = actual_ob_colx;
			var y2 = actual_ob_coly;
			var w2 = actual_ob_colx + this_obstacle.collision_w;
			var h2 = actual_ob_coly + this_obstacle.collision_h;

			if(bbox_overlaps(x1,y1,w1,h1,x2,y2,w2,h2)){
				//TODO DO SOMETHING
			}
		}
	}

	this.fall = function(){
		var now = time();
		// if on the ground, no change to y_veloticy
		if(this.onGround() && !key(_key_space)){
			this.y_velocity = 0;
		}else{
			// prevent falling if key is still held
			// or it's been more than 10ms
			if(
				key(_key_space)
			 	&& now - this.jump_started < 100)
			{
				// do nothing			
			}else{
				// start falling
				this.y_velocity+= this.fall_speed;

			}
		}
		// if i'm rising, don't rise 
		// faster than gravity allows
		if(this.y_velocity < this.y_gravity){
				this.y_velocity = this.y_gravity;
		}
		// if new position would be in the
		//  ground, set to ground
		var new_y = this.y + this.y_velocity;
		if(new_y >= this.resting_y){
			this.y = this.resting_y;
		}else{
			this.y += this.y_velocity;
		}
		// print('this.y: ' + this.y, 50,50,5);
		// print('this.onGround(): ' + this.onGround(), 50,55,5);
		// print('this.y_velocity: ' + this.y_velocity, 50,60,5);	
	}

	this.jump_started = false;
	this.jump = function(){
		if(!this.onGround()){
				return false;
		}
		this.y_velocity = this.jump_force;
		this.jump_started = time();
	}
	
	this.update = function () {
		// process falling
		this.fall();
		this.move();
	}

	this.draw = function () {
		spr(
			this.sprite_id,
			this.x,
			this.y,
			this.opaque_col,
			1,
			0,
			0,
			this.sprite_w,
			this.sprite_h
		);
	}

	return this;
}
var player = false;

function game() {
	// create player
	if (player === false) {
		player = create_player();
	}
	// create obstacle manager
	if (obstacle_manager === false) {
		obstacle_manager = create_obstacle_manager();
	}

	// clear screen
	cls(15);

	// draw ground
	map(0, 0, win_width, 20, 0, win_height - (8 * 2))

	// update playe
	player.update();
	
	// draw player
	player.draw();

	if(key(_key_space) && obstacle_manager.current_obstacles.length < 1){
		obstacle_manager.spawn_obstacle(1);
	}

	obstacle_manager.aupdate();
	obstacle_manager.adraw();
}

function menu() {
	cls(15);
	print("Billie Eilish Kart", 5, 5, 0, false, 2);
	print("Press [s] key to start!", 5, 20, 0);
	print("[r] key to return to menu.", 5, 30, 0);
	if (key(_key_s)) {
		state = 'game';
	}
}

function mainControls() {
	// return to menu
	if (key(18)) { // R
		state = 'menu';
	}
};

function TIC() {
	mainControls();
	if (state === 'menu') {
		menu();
	}
	if (state === 'game') {
		game();
	}
}

// <TILES>
// 000:3333333333737737773773777737777773777737777777777737777777777773
// 016:7777777777777777777777777777777777777777777777777777777777777777
// </TILES>

// <SPRITES>
// 000:ffffffffffffffffffffffddfffffdddffffddddffffdddcffffddd5666fdd55
// 001:ffffffffffffffffffffffffcfffffffcfffffffcffffffffffffffffff0ffff
// 016:f6ffdd55ff6fdf55f66666e6ff66666eff006666f0000666f0000fffff00ffff
// 017:5fc0ffff5cff6fff6666ffff666666ffeeeee00f66660000ffff0000fffff00f
// 032:fffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffff7
// 033:fffffff7ffffff73fffff733fffff733f77ff7337337f7333333773333337733
// 034:7fffffff37ffffff337fffff337fffff337fffff337fffff337fffff337ff77f
// 035:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 048:fffffff7fffffff7fffffff7fffffff7fffffff7fffffff7fffffff7ffffffff
// 049:3333773333337733333377333333773333337733333377333333773373333333
// 050:337f733733773333337733333377333333773333337733333377333333773333
// 051:ffffffff7fffffff7fffffff7fffffff7fffffff7fffffff7fffffff7fffffff
// 064:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 065:f7333333ff733333fff77733fffff733fffff733fffff733fffff733fffff733
// 066:33773333333333373333337f333337ff33777fff337fffff337fffff337fffff
// 067:7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 080:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 081:fffff733fffff733fffff733fffff733fffff733f7fff733737ff733f7ffff77
// 082:337fffff337fffff337fffff337fffff337fffff337fffff337fffff77ffffff
// 083:fffffffffffffffffffffffffffffffffffffffff7ffffff737ffffff7ffffff
// 255:0000000000000000000000000000000000000000000000000123456789abcdef
// </SPRITES>

// <MAP>
// 001:010101010101010101010101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </MAP>

// <WAVES>
// 000:00000000ffffffffff00000000ffffff
// 001:13456789abcdeff0123456789abcdefe
// 002:123456789abcdefffedcba9876543210
// </WAVES>

// <SFX>
// 000:b2c0b2c0b2c0b2b0b2a0b2a0b290b290b280b280b280b280b270b270b260b260b260b260b260b250b250b250b250b250b250b250b250b250b250b250a07009000000
// 001:020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200305000000000
// 062:008000800080008000800080008000800080008000800080008000800080008000800080008000800080008000800080008000800080008000800080009000000000
// </SFX>

// <PATTERNS>
// 000:b00016100000000000000000b00016100000e00016100000b00016100000000000100010b00016100000000000000000b00016100000000000000000b00016100000e00016100000b00016100000900016000000100010000010b00016100000000000000000b00016100000e00016100000b00016100000000000100010b00016100000000000000000b00016100000000000000000b00016100000e00016100000b00016100000900016000000000000100000000000000000000000000000
// </PATTERNS>

// <TRACKS>
// 000:100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ce00ff
// 001:100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ce00ef
// </TRACKS>

// <PALETTE>
// 000:140c1c00040030346d4e4a4e854c30951424d04648757161597dced27d2c8595a16daa2cd2aa996dc2cadad45edeeed6
// </PALETTE>

