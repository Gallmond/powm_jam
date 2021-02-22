// title:  test
// author: _gav
// desc:   just remembering how tic80 works
// script: js

var _key_space = 48; // space
var _key_s = 19; // a
var _key_left = 60; // LEFT
var _key_right = 61; // RIGHT
var _key_up = 58; // UP
var _key_0 = 27; // 0
var _key_1 = 28; // 1
var _key_2 = 29; // 2
var _key_3 = 30; // 3
var _key_4 = 31; // 4
var _key_5 = 32; // 5
var _key_6 = 33; // 6
var _key_7 = 34; // 7
var _key_8 = 35; // 8
var _key_9 = 36; // 9

var running = true;
var state = 'menu';

// window 240x136
// sprites are 8x8

var win_width = 240;
var win_height = 136;

var _alpha_color = 15;

// var _ground_speed = 1.5; // pixels per frame the obstacles and ground moves
var _ground_speed = 2; // pixels per frame the obstacles and ground moves
var _difficulty_modifier = 0;

var _min_obstacle_gap = 1000; // minimum possible milliseconds between obstacles

var _game_start_time = false;

// returns true if the bounding boxes overlap
function bbox_overlaps(x1,y1,w1,h1,x2,y2,w2,h2){
	var x1_high = x1 + w1;
	var y1_high = y1 + h1;
	var x2_high = x2 + w2;
	var y2_high = y2 + h2;
	return (x1 < x2_high && x2 < x1_high && y1 < y2_high && y2 < y1_high)
}




function obstacleManager(){

	// define possible obstacles here
	this.OBSTACLE_LIST = [
		{
			name:'cactus',
			spr_id:288, // id of sprite
			resting_y: win_height - (8*4) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 4, // number of sprites wide composite sprite is
			spr_h: 4,
			spr_scale:1, // scale of sprite
			collision_x: 9, // colliding area relative to sprite only
			collision_y: 2,
			collision_w: 14,
			collision_h: 30,
		},
		{
			name:'trash',
			spr_id:292,
			resting_y: win_height - (8*4) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 4, // number of sprites wide composite sprite is
			spr_h: 4,
			spr_scale:1, // scale of sprite
			collision_x: 9, // colliding area relative to sprite only
			collision_y: 14,
			collision_w: 15,
			collision_h: 18,
		},
		{
			name:'dad1',
			spr_id:296, // id of sprite
			resting_y: win_height - (8*4) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 2, // number of sprites wide composite sprite is
			spr_h: 4,
			spr_scale:1, // scale of sprite
			collision_x: 3, // colliding area relative to sprite only
			collision_y: 1,
			collision_w: 10,
			collision_h: 31,
		},
		{
			name:'dad1',
			spr_id:298, // id of sprite
			resting_y: win_height - (8*4) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 2, // number of sprites wide composite sprite is
			spr_h: 4,
			spr_scale:1, // scale of sprite
			collision_x: 3, // colliding area relative to sprite only
			collision_y: 1,
			collision_w: 10,
			collision_h: 31,
		},
		{
			name:'dad2',
			spr_id:300, // id of sprite
			resting_y: win_height - (8*4) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 2, // number of sprites wide composite sprite is
			spr_h: 4,
			spr_scale:1, // scale of sprite
			collision_x: 3, // colliding area relative to sprite only
			collision_y: 1,
			collision_w: 10,
			collision_h: 31,
		},
		{
			name:'rock1',
			spr_id:364, // id of sprite
			resting_y: win_height - (8*2) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 2, // number of sprites wide composite sprite is
			spr_h: 2,
			spr_scale:1, // scale of sprite
			collision_x: 1, // colliding area relative to sprite only
			collision_y: 4,
			collision_w: 11,
			collision_h: 11,
		},
		{
			name:'rock2',
			spr_id:366, // id of sprite
			resting_y: win_height - (8*2) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 2, // number of sprites wide composite sprite is
			spr_h: 2,
			spr_scale:1, // scale of sprite
			collision_x: 2, // colliding area relative to sprite only
			collision_y: 8,
			collision_w: 10,
			collision_h: 8,
		},
		{
			name:'rock3',
			spr_id:396, // id of sprite
			resting_y: win_height - (8*2) - (8*2) + 3, // floor height, sprite height, then offset
			spr_w: 2, // number of sprites wide composite sprite is
			spr_h: 2,
			spr_scale:1, // scale of sprite
			collision_x: 1, // colliding area relative to sprite only
			collision_y: 7,
			collision_w: 8,
			collision_h: 8,
		},
		{
			name:'bird',
			state:'idle',
			animation_speed: 2, // frames per second, ie how fast to cycle through the below
			animation_frame: 0, // which frame to display
			animation_last_frame: time(), // time() of last animation
			sprites:{
				'idle':[
					{
						spr_id:352,
						spr_w: 4, // number of sprites wide composite sprite is
						spr_h: 2,
						spr_scale:1, // scale of sprite
					},
					{
						spr_id:356,
						spr_w: 4, // number of sprites wide composite sprite is
						spr_h: 2,
						spr_scale:1, // scale of sprite
					}
				]
			},
			resting_y: win_height / 4,
			collision_x: 6, // colliding area relative to sprite only
			collision_y: 2,
			collision_w: 11,
			collision_h: 14,
		},
		{
			name:'dog',
			state:'idle',
			animation_speed: 2, // frames per second, ie how fast to cycle through the below
			animation_frame: 0, // which frame to display
			animation_last_frame: time(), // time() of last animation
			sprites:{
				'idle':[
					{
						spr_id:360,
						spr_w: 2, // number of sprites wide composite sprite is
						spr_h: 2,
						spr_scale:1, // scale of sprite
					},
					{
						spr_id:362,
						spr_w: 2, // number of sprites wide composite sprite is
						spr_h: 2,
						spr_scale:1, // scale of sprite
					}
				]
			},
			resting_y: win_height - (8*2) - (8*2), // ground sprites, this sprites,
			collision_x: 1, // colliding area relative to sprite only
			collision_y: 4,
			collision_w: 14,
			collision_h: 12,
		}
	];


	var min_time_between_obstacles = 100;
	this.spawnRandomObstacle = function(){
		var now = time();
		var diff = now - this.last_obstacle_spawned;
		// only if min time has passed, one in X chance of spawning
		if(diff > min_time_between_obstacles){

			// function returns a floating-point, pseudo-random number 
			// in the range 0 to less than 1 (inclusive of 0, but not 1) 
			if(Math.random() < 0.05){
				this.spawn_obstacle();
			}

		}
	}


	this.current_obstacles = [];

	this.last_obstacle_spawned = time();
	this.spawn_obstacle = function(obstacle_id){

		// don't spawn an obstacle if it's too close to the last one
		if(this.OBSTACLE_LIST.length > 0){
			if(time() - this.last_obstacle_spawned < _min_obstacle_gap){
				return false;
			}
		}

		// get random obstacle
		if(!obstacle_id && obstacle_id!==0){
			min = 0;
			max = Math.floor(this.OBSTACLE_LIST.length-1);
			var ob_id = Math.floor(Math.random() * (max - min + 1)) + min;
			var new_obs = p2 = Object.assign({}, this.OBSTACLE_LIST[ob_id]);
		}else{
			var new_obs = p2 = Object.assign({}, this.OBSTACLE_LIST[obstacle_id]);
		}

		// set initial x/y
		new_obs.y = new_obs.resting_y;
		new_obs.x = win_width;

		this.current_obstacles.push(new_obs);
		this.last_obstacle_spawned = time();
	}

	this.update = function(){
		for (var i = this.current_obstacles.length - 1; i >= 0; i--) {
			this.current_obstacles[i].x-= _ground_speed;
			// if this obstacle is now more than 32 pixels off the left, remove it
			if(this.current_obstacles[i].x  < -32){
				this.current_obstacles.splice(i,1);
			}
		}
	}

	this.draw = function(){
		// draw these obstacles
		var now = time();
		for (var i = this.current_obstacles.length - 1; i >= 0; i--) {
			var this_ob = this.current_obstacles[i];

			// if this object has an array of sprites it indicats its animated
			if(this_ob['sprites'] !== undefined){
				var delta = now - this_ob.animation_last_frame;
				var diff = 1000 / this_ob.animation_speed;
				// has enough time pased to move onto the next frame?
				if(delta > diff){
					var new_frame = this_ob.animation_frame + 1;
					this_ob.animation_frame = new_frame % this_ob.sprites[this_ob.state].length
					this_ob.animation_last_frame = now;
				}
				var this_sprite = this_ob.sprites[this_ob.state][this_ob.animation_frame];
				spr(
					this_sprite.spr_id,
					this_ob.x,
					this_ob.y,
					_alpha_color,
					this_sprite.spr_scale,
					0,
					0,
					this_sprite.spr_w,
					this_sprite.spr_h
				);
			}else{
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
	}

	return this;

}
var obstacle_manager = false;

function Player() {
	this.sprite_id = 256;
	this.sprite_w = 2;
	this.sprite_h = 2;
	this.opaque_col = 15;
	this.sprite_scale = 2;
	this.sprite_flip = 0;
	this.actual_sprite_width = (8 * this.sprite_w) * this.sprite_scale;

	this.movement_disabled = false;

	// collision is relative to the sprites position (ie, top left of the sprite) not the screen
	this.collision_x = 2 * this.sprite_scale;
	this.collision_y = 7 * this.sprite_scale;
	this.collision_w = 11 * this.sprite_scale;
	this.collision_h = 7 * this.sprite_scale;

	this.x = 10;
	this.y = win_height-(8*4);
	this.resting_y = win_height - (8*4) - (8*2) + 3;
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
		if(this.movement_disabled) return;
		if(key(_key_space) || key(_key_up)){
			this.jump();
		}
		if(key(_key_left)){
			this.x-= this.x_speed;
		}
		if(key(_key_right)){
			this.x+= this.x_speed;
		}

		// do not allow the player to move within 5 pixels of either side
		if(this.x < 0) this.x = 0;
		if(this.x > win_width - this.actual_sprite_width) this.x = win_width - this.actual_sprite_width;


	}

	this.is_exploded = false;
	this.explode = function(){

		if(!this.is_exploded){
			this.is_exploded = true;

			// disable player controls
			this.movement_disabled = true;
		
			// replace with exploded sprite
			this.sprite_flip = 2;

			// make explosion
			explosion(this.x, this.y, this);
			shake(2,200);

			// stop background moving
			_ground_speed = 0;

			// print game over message
			var text_content = "YOU CRASHED!"
			var text_width = print(text_content,-20,-20);
			var gameover_text_entity = {
				text_colour: 11,
				text_content: text_content,
				text_width: text_width,
				text_scale: 3,
				update: function(){},
				draw: function(){
					print(this.text_content, (win_width/2) - (this.text_width*this.text_scale/2),win_height/3,this.text_colour,false,this.text_scale);
				}
			}
			entities.push(gameover_text_entity);

			// print score
			var now = time();
			var diff = now - _game_start_time;
			var seconds = (diff / 1000).toFixed(2);
			var score_text_content = "Score: " + seconds;
			var score_text_width = print(score_text_content,-20,-20);
			var score_text_entity = {
				text_colour: 11,
				text_content: score_text_content,
				text_width: score_text_width,
				text_scale: 3,
				update: function(){},
				draw: function(){
					print(this.text_content, (win_width/2) - (this.text_width*this.text_scale/2),(win_height/3)+6*this.text_scale,this.text_colour,false,this.text_scale);
				}
			}
			entities.push(score_text_entity);
			


		}



	}

	this.check_collisions = function(){
		//get player collision box
		var actual_colx = this.collision_x + this.x;
		var actual_coly = this.collision_y + this.y;

		// for each obstacle
		for (var i = obstacle_manager.current_obstacles.length - 1; i >= 0; i--) {
			var this_obstacle = obstacle_manager.current_obstacles[i];

			// player bbox
			var x1 = actual_colx;
			var y1 = actual_coly;
			var w1 = this.collision_w;
			var h1 = this.collision_h;

			// obstacle bbox
			var x2 = this_obstacle.x + this_obstacle.collision_x;
			var y2 = this_obstacle.y + this_obstacle.collision_y;
			var w2 = this_obstacle.collision_w;
			var h2 = this_obstacle.collision_h;

			if(bbox_overlaps(x1,y1,w1,h1,x2,y2,w2,h2)){
				// collision debug
				// print("IS COLLIDING", 5,5,11);
				// rect(x1,y1,w1,h1,11);
				// rect(x2,y2,w2,h2,11);
				this.explode();
			}
		}
	}

	this.fall = function(){
		var now = time();
		// if on the ground, no change to y_veloticy
		if(this.onGround() && !(key(_key_space) || key(_key_up))){
			this.y_velocity = 0;
		}else{
			// prevent falling if key is still held
			// or it's been more than 10ms
			if(
				(key(_key_space) || key(_key_up))
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

		var new_y = this.y + this.y_velocity;

		// if new y would be on or below ground, but current y is not, shake
		if(new_y >= this.resting_y && this.y < this.resting_y){
			impact(4,200);
		}

		// if new position would be in the
		//  ground, set to ground
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
		this.check_collisions();
	}

	this.draw = function () {
		spr(
			this.sprite_id,
			this.x,
			this.y,
			this.opaque_col,
			this.sprite_scale, // scale
			this.sprite_flip, // scale
			0, // rotate
			this.sprite_w,
			this.sprite_h
		);
	}

	return this;
}
var player = false;

var entities = [];
var ground_offset = 0;
var clouds = [];
function game() {
	var game_now = time();

	// create player
	if (player === false) {
		player = new Player();
	}
	// create obstacle manager
	if (obstacle_manager === false) {
		obstacle_manager = new obstacleManager();
	}
	// set game start time
	if(_game_start_time === false){
		_game_start_time = time();
	}

	// clear screen
	cls(15);


	// draw background
	if(clouds.length===0){
		//init clouds
		var cloud_percent_separate = 0.2;
		var cloud_distance = Math.floor(win_width * cloud_percent_separate)
		var cloud_count = win_width/cloud_distance + 100; // lazy
		for(var i = 0, l = cloud_count; i < l; i++){
			clouds.push({
				x_offset: cloud_distance * i,
				sprite_id: 384,
				sprite_w: 4,
				sprite_h: 4,
			});
		}
	}else{
		for(var i=0, l=clouds.length; i<l; i++){
			// spr(id,x,y,alpha_color,scale,flip,rotate,cell_width,cell_height);
			clouds[i].x_offset-= (_ground_speed / 6)
			spr(clouds[i].sprite_id,
				clouds[i].x_offset,
				i % 2 == 0 ? Math.floor(win_height/5) : Math.floor(win_height/5) -15,
				_alpha_color,
				1,
				0,
				0,
				clouds[i].sprite_w,
				clouds[i].sprite_h);
		}
		if(clouds[clouds.length-1].x_offset < 0 - (8*clouds[clouds.length-1].sprite_w) ){
			clouds = [];// reset
		}
	}


	// draw ground
	// map(cell_x,cell_y,cell_w,cell_h,x,y,alpha_color,scale,remap);
	ground_offset-= _ground_speed;
	if(ground_offset < -8){
		ground_offset = 0;
	}
	map(0, 0, (win_width / 8 )+2, 3, ground_offset, win_height - (8 * 2))

	// update playe
	player.update();
	
	// draw player
	player.draw();

	// spawn obstacle? 
	obstacle_manager.spawnRandomObstacle();
	obstacle_manager.update();
	obstacle_manager.draw();

	// also do any entities
	if(entities.length > 0){
		for(var i=0, l=entities.length; i<l; i++){
			if(entities[i] != undefined){
				entities[i].update();
			}
			if(entities[i] != undefined){
				entities[i].draw();
			}
		}
	}
	// print("entities.length: " + entities.length,20,20,5);//TEMP
	
	//write score
	if(!player.movement_disabled){
		var score = ((game_now - _game_start_time) / 1000).toFixed(2);
		print(String(score),5,5,3);
	}
	
	// if(_ground_speed!=0){
	// 	// increase difficulty
	// 	var now = time();
	// 	var seconds = Math.floor(now / 1000); // seconds passed
	// 	if(seconds !== 0 && seconds % 5 === 0){ // this fires _every_ frame this is true, (ie 60 times while in this valid second)
	// 		var new_ground_speed = _ground_speed + 0.1
	// 	}
	// 	print("speed: " + _ground_speed,12,12,12);
	// }


	// var keyboard_byte = peek(0x0FF88);
	// print("keyboard_byte: " + keyboard_byte,20,25,5);//TEMP


}

function menu() {
	cls(15);
	print("Billie Eilish Kart", 5, 5, 0, false, 2);
	print("Press [s] key to begin!", 5, 20, 0);
	print("[r] key to restart the game.", 5, 30, 0);
	if (key(_key_s)) {
		state = 'game';
	}
}

function mainControls() {
	// return to menu
	if (key(18)) { // R
		reset();
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


function explosion(x,y,parent_entity){
	var explosion_entity = {
		parent_entity: parent_entity,
		x: x,
		y: y,
		animation_speed : 12, // frames per second
		animation_frame : 0,
		animation_last_frame : time(),
		sprite_ids : [
			258,
			260,
			262,
			264,
			266,
		],
		sprite_scale:2,
		delete: false,
		update: function(){
			// if this has a parent, which has x and y, use thos
			if(this.parent_entity){
				if(this.parent_entity.x) this.x = this.parent_entity.x;
				if(this.parent_entity.y) this.y = this.parent_entity.y;
			}
			var delta = time() - this.animation_last_frame;
			var diff = 1000 / this.animation_speed;
			// has enough time pased to move onto the next frame?
			if(delta > diff){
				var new_frame = this.animation_frame + 1;
				this.animation_frame = new_frame % this.sprite_ids.length
				this.animation_last_frame = time();
			}
			// delete if I fall out of screen
			if(this.x < -4) this.delete = true;
			if(this.y < -4) this.delete = true;
			if(this.x > win_width+4) this.delete = true;
			if(this.y > win_height+4) this.delete = true;
			if(this.delete){ // delete self
				for(var i=0, l=entities.length; i<l; i++){
					if(this == entities[i]){
						entities.splice(i,1);
					}
				}
			}
		},
		draw: function(){
			spr(this.sprite_ids[this.animation_frame],
				this.x,
				this.y,
				_alpha_color,
				this.sprite_scale,
				0, // flip
				0, // rotate
				2, // cell_width
				2 // cell_height
				);
		}
	}
	entities.push(explosion_entity);
}

// basically the same as a screen shake but it's just a downwards dent
function impact(intensity, duration){
	var hit_entity = {
		intensity: intensity,
		duration: duration,
		started:false,
		delete: false,
		update: function(){
			if(!this.started){
				this.started = time();
			}
			var now = time();
			if(now - this.started > duration || this.intensity === 0){
				this.delete = true;
				memset(0x3FF9,0,2); // reset screen shake
			}
			
			this.intensity--;

			if(this.delete){ // delete self
				for(var i=0, l=entities.length; i<l; i++){
					if(this == entities[i]){
						entities.splice(i,1);
					}
				}
			}
		},
		draw: function(){
			// start at max dent, then slowly decrease
			poke(0x3FF9+1,this.intensity*-1);
		}
	}
	entities.push(hit_entity);
}

function shake(intensity, duration){
	var shake_entity = {
		intensity: intensity,
		duration: duration,
		started:false,
		delete: false,
		update: function(){
			if(!this.started){
				this.started = time();
			}
			var now = time();
			if(now - this.started > duration){
				this.delete = true;
				// reset screen shake
				memset(0x3FF9,0,2);
			}
			if(this.delete){ // delete self
				for(var i=0, l=entities.length; i<l; i++){
					if(this == entities[i]){
						entities.splice(i,1);
					}
				}
			}
		},
		draw: function(){
			// do shake
			min = 0;
			max = this.intensity;
			var x_rand = Math.floor(Math.random() * (max - min + 1)) + min;
			var y_rand = Math.floor(Math.random() * (max - min + 1)) + min;
			poke(0x3FF9,x_rand);
			poke(0x3FF9+1,y_rand);
		}
	}
	entities.push(shake_entity);
}


function smoke(x,y,wind_velocity,duration){
	// create y many particles
	var num_particles = 3;
	// for each particles give them a random x and y velocity
	min_x = -4;
	max_x = 0;
	min_y = -4;
	max_y = 4;
	for(var i=0, l=num_particles; i<l; i++){
		rand_x_velocity = Math.floor(Math.random() * (max_x - min_x + 1)) + min_x;
		rand_y_velocity = Math.floor(Math.random() * (max_y - min_y + 1)) + min_y;
		var smokeEntity = {
			x:x,
			y:y,
			x_velocity:rand_x_velocity,
			y_velocity:rand_y_velocity,
			wind_velocity:wind_velocity,
			duration:duration,
			delete: false,
			update: function(){
				this.x += this.x_velocity;
				this.y += this.y_velocity;
				if(this.x < -4) this.delete = true;
				if(this.y < -4) this.delete = true;
				if(this.x > win_width+4) this.delete = true;
				if(this.y > win_height+4) this.delete = true;
				this.x--;
				if(this.delete){ // delete self
					for(var i=0, l=entities.length; i<l; i++){
						if(this == entities[i]){
							entities.splice(i,1);
						}
					}
				}
			},
			draw: function(){
				pix(this.x+1,this.y,10);
				pix(this.x-1,this.y,10);
				pix(this.x,this.y+1,10);
				pix(this.x,this.y-1,10);
			}
		}
		entities.push(smokeEntity);
	}
}


// <TILES>
// 000:3333333333737737773773777737777773777737777777777737777777777773
// 016:7777777777777777777777777777777777777777777777777777777777777777
// </TILES>

// <SPRITES>
// 000:ffffffffffffffffffffffddfffffdddffffddddffffdddcffffddd5666fdd55
// 001:ffffffffffffffffffffffffcfffffffcfffffffcffffffffffffffffff0ffff
// 002:ffffffffffffffffffffffffffffffffffff6ffffff696ffffff6fffffffffff
// 003:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 004:fffffffffffffffffffffffffff999fffff9699ffff9969ffff9999fffffffff
// 005:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 006:fffffffffffffffffffffffffff5555ffff56995ff559695ff599995f5596995
// 007:ffffffffffffffffffffffffff555fffff566fffff556ffffff55fffffffffff
// 008:fffffffffffffffffff5555fff55965fff55955ffff555ffffffffffffffffff
// 009:ffffffffff5555ffff5695ffff5555ffffffffffffffffffffffffffffffffff
// 010:f555ffff55ffffff5fffffffffffffffffffffffffffffffffffffffffffffff
// 011:fff5555ffffff95fffffff5fffffffffffffffffffffffffffffffffffffffff
// 016:f6ffdd55ff6fdf55f66666e6ff66666eff006666f0000666f0000fffff00ffff
// 017:5fc0ffff5cff6fff6666ffff666666ffeeeee00f66660000ffff0000fffff00f
// 018:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 019:ffffffffffffffffffffffffffffffffff6ffffff696ffffff6fffffffffffff
// 020:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 021:fffffffffffffffffffffffff999ffff9969ffff9999fffff969ffffff9fffff
// 022:f5996999f5996999ff556996fff55999ffff5599fffff596fffff566fffff665
// 023:55fff6ff655556ff6999965f96999655696999556999995f9969555f55555fff
// 024:ff555fffff5955ffff55655ffff5695fffff595fffff565ffffff5ffffffffff
// 025:fffff55fff55555ffff5595ff559996ff599995ff569995ff555555fffffffff
// 026:ffffffffffffffffff9ffffff55fffffff56fffffff5fffffff56fffffff5fff
// 027:fffffffffffffffffffffffffffffffffffffff6ffffff95ffff9995ff555555
// 032:fffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffff7
// 033:fffffff7ffffff73fffff733fffff733f77ff7337337f7333333773333337733
// 034:7fffffff37ffffff337fffff337fffff337fffff337fffff337fffff337ff77f
// 035:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 036:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 037:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 038:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 039:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 040:ffffff33ffffff13ffffff33ffffff33ffffff31fffffff3fffff555ffff5666
// 041:3333ffff3444ffff3333ffff1333ffff1333ffff3333ffff5553ffff6655ffff
// 042:ffffff33ffffff13ffffff33ffffff33ffffff31fffffff3fffff999ffff9eee
// 043:3333ffff3444ffff3333ffff1333ffff1333ffff3333ffff9993ffffee99ffff
// 044:ffffff33ffffff13ffffff33ffffff33ffffff31fffffff3fffff222ffff2888
// 045:3333ffff3444ffff3333ffff1333ffff1333ffff3333ffff2223ffff8822ffff
// 048:fffffff7fffffff7fffffff7fffffff7fffffff7fffffff7fffffff7ffffffff
// 049:3333773333337733333377333333773333337733333377333333773373333333
// 050:337f733733773333337733333377333333773333337733333377333333773333
// 051:ffffffff7fffffff7fffffff7fffffff7fffffff7fffffff7fffffff7fffffff
// 052:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 053:ffffffffffffffffffffffffffffffffff777777f7a333337aaaaaaa7a7777aa
// 054:ffffffffffffffffffffffffffffffff77ffffff377777ffaa333377aaaaaa33
// 055:ffffffffffffffffffffffffffffffffffffffffffffffff7fffffff37ffffff
// 056:fff56666ff566666f5666666f5666666f5666666f5566666ff556666ffff5555
// 057:66665fff55555fff63365fff63365fff63365fff33365fff63365fff5555ffff
// 058:fff9eeeeff9eeeeef9eeeeeef9eeeeeef9eeeeeef99eeeeeff99eeeeffff9999
// 059:eeee9fff99999fffe33e9fffe33e9fffe33e9fff333e9fffe33e9fff9999ffff
// 060:fff28888ff288888f2888888f2888888f2888888f2288888ff228888ffff2222
// 061:88882fff22222fff83382fff83382fff83382fff33382fff83382fff2222ffff
// 064:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 065:f7333333ff733333fff77733fffff733fffff733fffff733fffff733fffff733
// 066:33773333333333373333337f333337ff33777fff337fffff337fffff337fffff
// 067:7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 068:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 069:f7759477f5959449f7b7b7bdf7baaaaaf7baaaaaf7ab7aa3f7a3baa3f7a37aa3
// 070:77a4aaaadd4777a774777777aaaaaa37aaaaaa377a37aa117a37aa117a37a331
// 071:a7ffffff7fffffffffffffffffffffffffffffff111fffff111fffff11ffffff
// 072:ffff1f11ffff1111ffff2228ffff2228ffff2222ffff2222ffff2222ffff2222
// 073:1111ffff1111ffff22222fff82222fff88222fff28822fff22222fff2222ffff
// 074:ffff1f11ffff1111ffff2228ffff2228ffff2222ffff2222ffff2222ffff2222
// 075:1111ffff1111ffff22222fff82222fff88222fff28822fff22222fff2222ffff
// 076:ffff1f11ffff1111ffff2228ffff2228ffff2222ffff2222ffff2222ffff2222
// 077:1111ffff1111ffff22222fff82222fff88222fff28822fff22222fff2222ffff
// 080:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 081:fffff733fffff733fffff733fffff733fffff733f7fff733737ff733f7ffff77
// 082:337fffff337fffff337fffff337fffff337fffff337fffff337fffff77ffffff
// 083:fffffffffffffffffffffffffffffffffffffffff7ffffff737ffffff7ffffff
// 084:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 085:ff737aa3ff737aa3ff737aa3ff737aa3ff737aa3ff7a3aaaff7aaaaafff77777
// 086:7a37a3bb7a37a1b17a37a1107a37a1107a37a1103aa3a141aaaaa14177777744
// 087:11ffffff000fffff000fffff0001ffff00011fff000011ff000044ff01001fff
// 088:ffff2222ffff2222ffff2222ffff2222ffff2222ff444444f4444444f4444444
// 089:2222ffff2222ffff2222ffff2222ffff2222ffff4444ffff4444ffff4444ffff
// 090:ffff2222ffff2222ffff2222ffff2222ffff2222ff444444f4444444f4444444
// 091:2222ffff2222ffff2222ffff2222ffff2222ffff4444ffff4444ffff4444ffff
// 092:ffff2222ffff2222ffff2222ffff2222ffff2222ff444444f4444444f4444444
// 093:2222ffff2222ffff2222ffff2222ffff2222ffff4444ffff4444ffff4444ffff
// 096:fffff77fffff7337fff73337ff733333f73333337333333377777773fffffff7
// 097:ffffffffffffffffffffffff7fffffff7777777f333333373333333333333333
// 098:ffffffffffffffffffffffffffffffffffffffffffffffff7777777f3333337f
// 099:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 100:fffffffffffffffffffffff7fffffff7fffff777ffff7337fff73337ff733333
// 101:ffffffff7fffffff37ffffff337fffff3337ffff33337fff333337ff7333337f
// 102:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 103:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 104:ffffffffff7ffff7f76fff76f76fff7677777777777a7777717a717771aaa177
// 105:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 106:ff7ffff7f76fff76f76fff7677777777777a7777717a717771aaa177aa11aaa7
// 107:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7777f3
// 108:ffffffffffffffffffffffffffff3333fff33a43ff33a444ff3a4444f3a44443
// 109:ffffffffffffffffffffffffffffffff33ffffff311fffff3111ffff1441ffff
// 110:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff33
// 111:ffffffffffffffffffffffffffffffffffffffffffffffff333fffffa73fffff
// 112:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 113:7333333373333333733333337333377773337fff7337ffff737ffffff7ffffff
// 114:333777ff333337ff33777fff77ffffffffffffffffffffffffffffffffffffff
// 115:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 116:f73333337333333377777773fffffff7ffffffffffffffffffffffffffffffff
// 117:7333337f33333337333333333333333373333333f7333333ff733333fff77777
// 118:ffffffffffffffff7777777f3333337f333777ff333337ff33777fff77ffffff
// 119:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 120:aa11aaa7aaa61aa7faa6aa77f3aaa377f7333777f7733773f77ff77ff3fff3ff
// 121:ff7777f37777777a77777777777777777777777733333777f77ff77ff3fff3ff
// 122:aaa61aa7faa6aa77f3aaa377f7333777f7733773f77ff77ff77ff77ff3fff3ff
// 123:7777777a77777777777777777777777733333777f77ff77ff77ff77ff3fff3ff
// 124:f3444443f3334431331133313a4411143444414431444144f1111144ffffff11
// 125:14411fff44441fff44441fff44441fff44441fff44441fff44411fff1111ffff
// 126:ffffff3afffff33afffff3a7ff333377f3a773773a7777373777773733333333
// 127:7773ffff7773ffff7773ffff77773fff77773fff777773ff777773ff333333ff
// 128:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 129:fffffff7ffffff7fffff77fffff7fffffff7fffffff7ffffff7ffffff7fff33f
// 130:77ffffffff7ffffffff7fffffff7f7ffffff7f7ffffffff7ff3ffff7fff3fff7
// 131:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 140:ffffffffffffffffffffffffffffffffffffffffffffffffff333ffff33a73ff
// 141:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 144:ffffff77fffff7ffffff7ffffffffffff77fffff7fffffff7fffffffffffffff
// 145:7fff3fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 146:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 147:7ff7ffff7f7f7ffff7ff7fffffff7fffffff7f7ffffff7f7fffffff7ffffff77
// 156:f3a7773ff3a777733a77777a3a77777a377777a73777777733377777ff333333
// 157:ffffffffffffffff3fffffff3fffffff73ffffff773fffff333fffffffffffff
// 160:f7ffffffff7ff3fffff7ff3fffff7ff3ffff7ffffffff777ffffffffffffffff
// 161:ffffffffffffffffff3fffff3333fff3fff333337ffff33ff7ffffffff77fff7
// 162:fffffffffff3ffffff3fffff3333ff3f33f333ffffff3fff7ffffff7f77ff77f
// 163:fffff7ffffff7ffffffff7ffffffff7fffffffffffff77ffff77ffff77ffffff
// 176:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 177:ffff777fffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 178:ff777fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 179:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 255:0000000000000000000000000000000000000000000000000123456789abcdef
// </SPRITES>

// <MAP>
// 001:010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
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

