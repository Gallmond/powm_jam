// title:  Billie Eilish Kart
// author: _gav
// desc:   First TIC-80 Game. Theme "You are the bad guy". Approx 30 hours.
// script: js

// keys
var _key_space = 48; // space
var _key_s = 19; // a
var _key_m = 13; // m
var _key_n = 14; // n
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

// sound effects
var _sfx_id_explode = 12;
var _sfx_id_jump = 13;
var _sfx_id_land = 14;

// game states
var running = true;
var state = 'menu';

// for convenience
var win_width = 240;
var win_height = 136;

// colour not to draw
var _alpha_color = 15;

// some gameplay settings
var _ground_speed = 1.5; // pixels per frame the obstacles and ground moves
var seconds_between_increase = 5; // how often to tick up the speed
var speed_increase = 0.1; // how much to increase speed by
var last_set_second = 0; // when was the last increase 
var _min_obstacle_gap = 1000; // minimum possible milliseconds between obstacles
var _game_start_time = false; // to keep score

// returns true if the bounding boxes overlap
function bbox_overlaps(x1,y1,w1,h1,x2,y2,w2,h2){
	var x1_high = x1 + w1;
	var y1_high = y1 + h1;
	var x2_high = x2 + w2;
	var y2_high = y2 + h2;
	return (x1 < x2_high && x2 < x1_high && y1 < y2_high && y2 < y1_high)
}

// helper for managing obstacles.
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


	this.spawnRandomObstacle = function(){
		// don't spawn an obstacle if it's too close to the last one
		if(this.OBSTACLE_LIST.length > 0){
			if(time() - this.last_obstacle_spawned < _min_obstacle_gap){
				return false;
			}
		}

		// percent chance to spawn an obstacle (per frame!)
		if(Math.random() < 0.05){
			this.spawn_obstacle();
		}

	}


	this.current_obstacles = [];
	this.last_obstacle_spawned = time();
	this.spawn_obstacle = function(obstacle_id){

		// get random obstacle
		if(!obstacle_id && obstacle_id!==0){
			min = 0;
			max = Math.floor(this.OBSTACLE_LIST.length-1);
			var ob_id = Math.floor(Math.random() * (max - min + 1)) + min;
			var new_obs = Object.assign({}, this.OBSTACLE_LIST[ob_id]); // have to make a copy of the object to avoid passing by reference
		}else{
			var new_obs = Object.assign({}, this.OBSTACLE_LIST[obstacle_id]);
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

// for managing the player
function Player() {
	this.sprite_id = 256;
	this.sprite_w = 2; // number of composite 8x8 sprite 'blocks' this uses
	this.sprite_h = 2; 
	this.opaque_col = _alpha_color;
	this.sprite_scale = 2;
	this.sprite_flip = 0;
	this.actual_sprite_width = (8 * this.sprite_w) * this.sprite_scale; // actual sprite with after scaling and composite size

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
	
	// some "physics" settings
	this.jump_force = -7;
	this.y_velocity = 0;
	this.y_gravity = -50;
	this.fall_speed = 0.5;
	this.x_speed = 3;
	
	this.onGround = function(){
		// return true if y pos is at  'resting' height
		return (this.y >= this.resting_y)
	}
	
	this.move = function(){
		if(this.movement_disabled) return;
		if(key(_key_space) || key(_key_up)){ // jump
			this.jump();
		}
		if(key(_key_left)){ // move left
			this.x-= this.x_speed;
		}
		if(key(_key_right)){ // move right
			this.x+= this.x_speed;
		}

		// stop player moving outside of the viewport
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

			// wobble the screen
			shake(2,200);

			// explosion noise
			sfx(_sfx_id_explode, 'C-4', 60,3);
			
			// stop music and play gameover theme
			music_manager.stop();
			music(2,-1,-1,0,0);
			
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

			// restart text
			var restart_text_content = "[r] to restart";
			var restart_text_width = print(restart_text_content,-20,-20);
			var restart_text_entity = {
				text_colour: 11,
				text_content: restart_text_content,
				text_width: restart_text_width,
				text_scale: 1,
				update: function(){},
				draw: function(){
					print(this.text_content, (win_width/2) - (this.text_width*this.text_scale/2),5,this.text_colour,false,this.text_scale);
				}
			}
			entities.push(restart_text_entity);

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

		// what will our new Y be with this change?
		var new_y = this.y + this.y_velocity;

		// if new y would be on or below ground, but current y is not, shake
		if(new_y >= this.resting_y && this.y < this.resting_y){
			impact(4,200);
			sfx(_sfx_id_land,'C-1', 10, 1);
		}

		// set new height, but not below the resting height
		if(new_y >= this.resting_y){
			this.y = this.resting_y;
		}else{
			this.y += this.y_velocity;
		}

	}

	this.jump_started = false;
	this.jump = function(){
		if(!this.onGround()){ // no double jumps sadly
				return false;
		}
		sfx(_sfx_id_jump, 'E-4', 15,2); // jump sound
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

	// init the manages if they don't exist alreay
	if (player === false) {
		player = new Player(); // create player
	}
	if (obstacle_manager === false) {
		obstacle_manager = new obstacleManager(); // create obstacle manager
	}
	if(_game_start_time === false){
		_game_start_time = time(); // set game start time (for scorekeeping)
	}

	// clear screen
	cls(15);

	// draw background
	if(clouds.length===0){
		//init clouds
		var cloud_percent_separate = 0.2; // ie 0.2 is a cloud every 20% of the
		var cloud_distance = Math.floor(win_width * cloud_percent_separate)
		var cloud_count = win_width/cloud_distance + 100; // hardcoded 100 clouds + enough to fill one screen. Very lazy
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
			// move the clouds
			clouds[i].x_offset-= (_ground_speed / 6)
			// draw the clouds
			spr(clouds[i].sprite_id,
				clouds[i].x_offset,
				i % 2 == 0 ? Math.floor(win_height/5) : Math.floor(win_height/5) -15, // offset every other cloud
				_alpha_color,
				1,
				0,
				0,
				clouds[i].sprite_w,
				clouds[i].sprite_h);
		}
		// reset if the last cloud is off the edge of the screen
		// very lazy...
		if(clouds[clouds.length-1].x_offset < 0 - (8*clouds[clouds.length-1].sprite_w) ){
			clouds = [];// reset
		}
	}


	// draw ground. It's the only map sliding along and resetting every 8 pixels
	ground_offset-= _ground_speed;
	if(ground_offset < -8){
		ground_offset = 0;
	}
	map(0, 0, (win_width / 8 )+2, 3, ground_offset, win_height - (8 * 2))

	// update player
	player.update();
	
	// draw player
	player.draw();

	// spawn and manage obstacles 
	obstacle_manager.spawnRandomObstacle();
	obstacle_manager.update();
	obstacle_manager.draw();

	// also do any entities
	// Hardly anything even uses this what a waste
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
		
	//write score in the corner
	if(!player.movement_disabled){
		var score = ((game_now - _game_start_time) / 1000).toFixed(2);
		print(String(score),5,5,3);
	}
	
	// increase difficulty
	if(_ground_speed!=0){
		var now = time();
		var seconds = Math.floor(now / 1000); // seconds passed
		if(
			seconds !== 0 && // if not at the very start
			seconds % seconds_between_increase === 0 && // and seconds is a multiple of our setting
			last_set_second !== seconds // and it wasn't already increased THIS second
		){
			_ground_speed += speed_increase; // add difficulty
			last_set_second = seconds; // make note of when we last did this
		}
	}

	// some debug stuff shh
	if(key(_key_0)){
		print("_ground_speed: " + _ground_speed,5,10,2);
		print("entites.length: " + entities.length,5,15 + 1,2);
	}

}

// helper for managing music
var _music_ended = false
var _main_track_started = false;
var _second_track_started = false;
var _fired = 0;
function musicManager(){

	this.playing = true;

	this.reset = function(){
		_music_ended = false;
		_main_track_started = false;
		_second_track_started = false;
	}

	this.stop = function(){
		music();
		this.playing = false;
	}

	this.start = function(){
		this.playing = true;
		this.reset();
	}

	this.play = function(){

		// (re)start
		if(key(_key_n)){
			this.start();
		}
		// stop
		if(key(_key_m)){
			this.stop();
		}

		if(!this.playing){
			return;
		}

		// var track = peek(0x13FFC)
		// var frame = peek(0x13FFD)
		// var row = peek(0x13FFE)
		// var flags = peek(0x13FFF)

		// var yi = 0;
		// print("track: " + String(track), 5, 50 + (6*yi++), 1);
		// print("frame: " + String(frame), 5, 50 + (6*yi++), 1);
		// print("row: " + String(row), 5, 50 + (6*yi++), 1);
		// print("flags: " + String(flags), 5, 50 + (6*yi++), 1);

		// wait a second before first go
		if(time() < 1000){
			return;
		}

		// start the main track and set started
		if(!_main_track_started){
			music(0,-1,-1,0,0);
			_main_track_started = true;
		}

		var track = peek(0x13FFC)

		// if the main track has run, but the second track hasn't run, but nothing is now playing
		if(_main_track_started && !_second_track_started && track===255){
			music(1,-1,-1,0,0); // start second track and set started
			_second_track_started = true;
		}

		// if both tracks are played and finish, restart (after a delay)
		if(_main_track_started && _second_track_started && track===255){
			if(_music_ended === false){
				_music_ended = time();
			}
			if(time() - _music_ended > 5000){
				this.reset();
			}
		}
	}
}

function menu() {
	cls(15);
	print("Billie Eilish Kart", 5, 5, 0, false, 2);
	print("Press [s] key to begin!", 5, 20, 0);
	print("[r] key to restart the game.", 5, 30, 0);
	print("Arrow keys & Space to move.", 5, 40, 0);


	print("[m] and [n] to stop/start music.", 5, win_height-5-5, 0);

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


var music_manager = new musicManager();

// main loop
function TIC() {
	mainControls();
	music_manager.play();
	if (state === 'menu') {
		menu();
	}
	if (state === 'game') {
		game();
	}
}

// exploding sprite attached to an x,y pos
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

// wobble the screen down
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

// shake the screen
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
				memset(0x3FF9,0,2); // this is the x/y offset of the screen
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
// 000:00000000fffffffff00000000fffffff
// 001:0123456789abcdef0123456789abcdef
// 002:0123456789abcdeffedcba9876543210
// </WAVES>

// <SFX>
// 000:b2c0b2c0b2c0b2b0b2a0b2a0b290b290b280b280b280b280b270b270b260b260b260b260b260b250b250b250b250b250b250b250b250b250b250b250a77009000000
// 001:02000200020002000200020002000200120012002200220032003200420052005200620062007200820082009200a200b200c200c200d200f200f20045a000000000
// 012:2300230023002300230023002300230033003300430043005300530063006300630073007300830083009300a300b300b300c300d300e300e300f300300000000000
// 013:62e062d062c062506250625062406240624062406240624062506250625062606260626062606270627062806280629062a062a062b062c062d062e0325000000000
// 014:83b093b0a3b0c3b0d3b0f3b0f3b0f3b0f3b0f3b0f3b0f3b0f3b0f3b0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0f3a0000000000000
// </SFX>

// <PATTERNS>
// 000:800016100010000000000000800016100010b00016100010800016100010000000000000800016100010000000000000800016100010000000000000800016100010b00016100010800016100010700016000010000010000010100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 001:b00016100010000000000000b00016100010e00016100010b00016100010000000000000b00016100010000000000000b00016100010000000000000b00016100010e00016100010b00016100010a00016000010000010000010100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 002:d00016100010000000000000d00016100010400018100010d00016100010000000000000600016100010000010000010600016100010000010000010600016100010600016000000000010000010100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 003:e00018100010000010000010e00018100010000000000000000000000000e00018100010000000000000e00018100010000000000000e00018100010000000000000e00018100010000000000000b0001810001040001a000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 004:b00014000000000000000000000000000000000000000000000000000000000000000010000010000000000000000010b00014000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 005:400016000000000000000000000000000000000000000000000000000000000000000010000010000000000000000010400016000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 006:e00018100010000010000010e00018100010000000000000000000000000e00018100010000000000000e00018100010000000000000e00018100010000000000000e00018100010000000000000b0001810001060001a000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 007:d00018100010000000000010d00018100010000000000010000000000010d00018100010000000000000d00018100010000010000010b00018100010a00018000010000010100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 008:600016000000000000000000000000000000000000000000000000000000000000000010000010000000000000000010600014000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 009:d00018100010000000000010d00018100010000000000010000000000010d00018100010000000000000d00018100010000010000010b00018100010a00018000010100010000010000010000010e00018100010e0001810001040001a100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 010:40001a100010000000000000b00018100010000000000000e0001810001040001a10001040001a100010e0001810001040001a100010000000000000b00018100010000000000000e0001810001040001a10001040001a100010e00018100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 011:40001a100010000000000000b00018100010000000000000e0001810001040001a10001040001a100010e0001810001040001a100010000010000000b00018000010000000000000100010000010000010000010e00018100010e00018100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 012:90001a00001010001000000060001a000010100010000000e0001810001040001a10001040001a100010e0001810001090001a00001010001000000060001a000010100010000000e0001810001040001a10001040001a100010e00018100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 013:90001a00001010001000000060001a000010100010000000e0001810001040001a10001040001a100010e0001810001090001a00001010001000000060001a00001000001000000000001000001010001000001040001a000010e00018000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 014:600016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 015:d00018000000000000000000000000000000000000000000000010000000b00018000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 016:b0001800000060001a00000060001a000000b0001800000050001a00001060001a00001050001a000000e00018000000b0001800000060001a00000060001a000000b0001800000050001a00001060001a00001050001a000000e00018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 017:40001a000000b0001a000000b0001a00000040001a000000a0001a000010b0001a000010a0001a00000070001a00000040001a000000b0001a000000b0001a00000040001a000000a0001a000010b0001a000010a0001a00000070001a00000010001000000010001000000010001000000010001000000010001000001010001000001050001a000000e0001a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 018:60001a000000d0001a000000d0001a00000060001a000000a0001a00000060001a00000060001a00000040001a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 019:600016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 020:40001a000000e00018000000d55618000000000000000000000010000000000010000000000000000000b99618000000000010000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </PATTERNS>

// <TRACKS>
// 000:0400000400000800000c00005010005010006c10009020005010005010006c10009820005c2000503000643000f83000ce02ff
// 001:0040005440005440006840004d4000000000000000000000000000000000000000000000000000000000000000000000ce02ff
// 002:045000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007110
// </TRACKS>

// <PALETTE>
// 000:140c1c00040030346d4e4a4e854c30951424d04648757161597dced27d2c8595a16daa2cd2aa996dc2cadad45edeeed6
// </PALETTE>

// <COVER>
// 000:34b400007494648393160f008800070000c2000000000f008800788080800101010101006e5b5a9180016dc9496eda5afe5b5a7f5c5cfedbdb7f5cec6dda5a6edb5bedc9c9c8a5a3b613125bb6b6019191c9b6366e5b5b5c4948edc9c8372492ec48480100007fecdb7f5c5b7f6dec361301129191918000a39212259180dab6b60001006e3748b7a4a3a592016d49483624a32513926eda490191806dda49db4848911291a391916e375bdb48b7c9a5a55cb6b66e376eed24256eed48b69137c9ed5bc9ed6e6e5c5b8080006e48c836246e6e24ed3624da48a41349b691fe5a5a5bb7b6eced5bb7a525b6249124130137a4a4db37b75ab7484924135b5a5aeced6e01dbed01dba501dbc901db915a01c8c8a4a43724135ac9487f6e6ec8a5a5b691126dc95a7f6ded5c49490101a4012491fe37015c37016e01c801016e0101dada242501feed01fea50149a50149ed01fec901fe910149910149c95a24c801b6a501b6ed01b69101b6c9a5b69137c8a56ec9c95b6e255bda255b6e915bda91496e2549da25496e9149da914991a56d6e256dda256d6e916dda91ecb6b713dbed13dba513dbc913db915a01dac9019237dbed37dba537dbc937db91fe01915b01ed25c8a525dbed25dba525dbc925db91ec01914901ed49b6a3129180b73612b691800101b70124a42401a4c95aec7fdb5bdbb624a536a5a30180fe37245a24016e24c801246e0124daecda5cfeda5cc901807f5c6d5b376e5b375b6e01da13016e1301dafe01a537016e6e01fe3701da49376e49375bec01a525016e6e01ec2501da37b6c949a5a3b6132437feed37fea53749ed13feed13fea51349a51349ed13fec913fe913749911349911349c937fec937fe915a24da3749c9fe24915b24ed13b6a513b6ed13b69113b6c937b6ed25b6c925feed25fea52549ed25499125fec925fe912549c9ec24914924ed25b6ed6eb636242437ec5afe0124b72401b7b601a4c9fe48c95c48da91257f6e257fda257f6e917fda91c95afe24a3246e24da13246e1324dafe6e5bc93648b6a4b6918091fe5afedbfe48db5c486ec95afedadb008001a51301fe5a5b808091fe6eec01000100000080000080ff00304088040b301c802031a2438d14e548e010a304497a031e3438513120000108366c4859e3c9090942485981654a84981c25ac94590336ab4594246a59a97235a401221420c8f92785c58607021860408439a2d5a9493d189060a141820d024488e921268308953bb298fa3584c4992726a8593b74e88493242e44907159a2118a421beacde059226d57182af698fb522f958f1e0a0b302c61a84e30c2890b1e2c42a8cf50102a4c3892e060a4cb8809264cfc8032e34a80152e7488f0f3f7ce8ba502edf04288ca52196fbadea9e0884e69d444c68dfa746cef61bf5d5e6df1d295a01614124869606081030407433020be6d73c5f4a7493d4810d04ae3ff780d33646d49b5944a7927b17a40610f398092982da8e241e20e6005137b301098ffdd5fa911728f5f1490c185042cf0e89a761c30b855690216e8146012806406828190a917661596909f7b99966a11010898b09b6f1d64ca97491552c71b5369f62cdc8ce1d673ed653e41abc85d3ad673e41ce5c048da424021250c04181060c10c9077c45256d96090c107044550c50418016e572c25e292997959302668024c27a5410b0061b0ca9cc1b0651117f1e717908019c5722e521d70d7911081a0389520993069426b8df5d8930ae916195e39125690666e05148ad24c0904d24d542244909981a17ada1b6d19b8a01f5350a072c90f0495ab017f55f63c1bff5736f879d8556585350b5d51d47c5c0b2510666a960c00c0c1584567808676d925a1877c4610c20c0120b4266f4662c076a01f3929a6aa9d6e77314b985061a586162d1150ed5271d5ffdc5ff500471f9d71f55241161c0638a303504808d306f21af819061448e7adbc1a6679e540227aa9a149714482a24fea048054cb19b8e110062a0020110c71a0baa5046107732b79e10914e56f04dafbdf625c65254e2539a456a011205034910310729181ba4967ad125dd1452554b955f401040ad2c0cc150c24a9351b93ce402d9470e6b9351b0218519be70be2d5722cbf9988f10f9640a00208c54c286812654c30c8d0651246a859049506a0a24f05a6209aff05a1349966a5794c1676411b24c11b82aa4cd1c72d75f8fb9cab593092dc4a295149bc4ce14e3c1e4a59fae04e24da99b313745515904608dd67a4d2b452723081095221c5a97ade50355105e25560c2030c0031c7755b470c3452ea9b1301144c90f908dae210371cb8758482cb576bfbc06bdf3c381122854852b86bd3079091a5654cf012e34d28e53876aa790e6ad76408a0126640a6744046c167ef2017c0fe7c33a4bc4ec52138ba46b2b5bd2c656b0206e192c8565282123d7e8a5138c6121240c289a430600c984dd25630a0056925831c00c2df4c66030318902779bb63d206850c32615d885c000e9474c5ab3814f4ca0740710e5c4401bfc452ff4e101be049dcf452041c9fa24f300fdbd2e68fa7ccdb83067bac4364122f8c45406d7110fb92ca5028b0cddfe0702aa80a8e2698bef57cc5300c318d6273650b6550920b24a3a61c40410a04104f8410d24e1160840c6d55cc44da3ad55ca5824d6da01a35c2e91be295cc24a4202101bbf3ef4af89b3c24ee0a3d08635fe894fb360c20eb33ac1006dcf8c20b9d6dcb63db671e90e53798b49de30e20fe928e13bdb1fdf583060b7cc166c75e3b71afc53a0b685524b8d0b0c57a245aa14c9044f7100ffdf74e53c179ce44b541851410650d6a41872f58f94fd1394b9934a0c6bec4a0447e901d967c62570757f8c872590a2abba72b01b04eccd9904096ff51ca8400905ea439627a2e74814946b68209b898c44f0bcb44f6a956b0cc30ee578164ddbe05873b08f2d109819c456cc7358e4d544c8b7bab881535a0110c1ea5398bd8898832efbe85cb050ab832099a7276ac3ae1b771bbe9e723493c36048b894259204d13f8a24c3a2519acc951639a85a18ae0250861944083b8586f461ee3580a4bb0890a10c980ba6162054b01040238cc1d25a2972d394864f8d5fe278a34d88744b7d062c7a8a72add879a15f5a0ce105dbfb00a689ea9e00cf0e721939e700c836cf8ca43f79135c524cf7d10eb4950288dc51a7be77c95aa5d058a2d1d04e0aa6634356ce6109f4d7aa01ba35916585d821fc6d177210051c2ff4721ba5e2c912107764d600500f9f2412030420a585049bca266d5a9a2942728e08700690facb0e94ab11171c18c2341564df59a865c98e647b711a4bd4490b11903a0e6b81643ca16f30422d8ca45548839c6c47f7644d5c90652b39c3e639b903cfdd77e92c0021230e00c081de761c54a4625a0c009a56d2552500d1d91722aa2554650d64853c5047270a9b3d289e2c3251fd6fe810030d0b404d4120c2810e20ac1d6d27da0720f044f4c62d5208435226d5e35e348987d9285000318116af27b7073bb1ed8cbaed5c626399b4ef0414a53fe5ef14335a1d4811aa652120e6968f58b14ff676b68fd1ec6f4f4bc4262968750d94f62a95b99fc600a99ff1c3c220f48d383559d2570104b533715b3c030edea0650600a042002050060861420850b2c3d0386cd420e7772ef4900a0c30fc510cb21a7e0551c3c27c91d08df0a15399c78773061918b1682987f2db9a753572d5fa81b2235e5dc5ca547a171c90e80210c024d2c9f2c8d1825ccc9c204504a55e181c62538edcd27fe8a2c66667870c94538defc295a085a8776bcb208ade1f29351fdd2085030832861ae3750214d45a0940f0f410b542883e127b6728a487026a3f3c3d345f411552ed23c7f30805e3ca8dbc08d8fe3a75cf092911bb4e48f5a2c64aa5d8000d8b839899aca0ab6d4a2b1a3d3d71a6cb865bb5e0d1d4013080c6b20997c8a073db9e6ff6733b0f9d5660ed48fec1bd4a42048abcecd9e4594628508eeaf8174c53f0f8003e7cdd7471258d120d37dd395e15a502e109b2473ab471be2a04037b48c80cae691ad1741d2af79745e3c7cb09610b779c7254c2fd8354aa69e46b32f0f766fdede3d441090672030d6f997bcd621fce37a595ee3fe1b00a9421c500dca3fca9014b01ec49365fdc566816202e912484625c87637c3a933a6b7412cd44ee9aa7c10dfc2272099a5a72661f7211050408977248e733ecb0d8d88763b718fa03282f17e3613640f75f592758122bddcf45077d40e01ec4edb540c33e6f68b333174f3afdbd1e5f18651dd5f8359537870dc637e299987bcc91560f850428217ff0f6d4850b743009041876f997fca14337997202debec58f858490e9ce6f857c41a607b49a2471aa0d5720440e90b409e60f0c34ab0808440f37847210740820f90fc51d4722ec7ee2ee24711211b7720bf6a82191c107822a6bb7615291646520223611110367601567ba62114441a1911964e22c13000a20000338bf1a01a20c71ab0174a424d7b27c24e43665bd2ab3850fe11e21e28e2c20653a50300c62c90d00cc1866a87e061e1c42700300394c41b10024143424bc6a35bf4e76030bc33211f0740be0be09404505a05505a0940b405a04087316e6f003a7861c34820ec5ef3c133f3113ef1122121f106751e30e3303ff66e3a02373781cf2e7231ff5610e67685d205c4a07b50601b73b22964c13b98017e113f58367f5662cc1053f38d16dc12102278a4c20fd6440d319406f13214c56c56503e21c38760d2a14b76620ad6151fe70b5bc29105d6ac25d6800443b74a50a65dd6b53740ac3e905a0ac09501f08b0b408b08b02d81785a0a50940210b61808c346e6de6bc30180d4e78cf1201d050b7540720282382350a81f18791b15c15a81773902098413a03ae3298625601e28100e01b222a2c22338f07638ba7bf12117b6650e17474c74af44740305045771208409400f00f67f17087209087f1520fe1dd24a41d2148833a52a950167582d66d1a009d1c582941e2ab3697bd4b00410b53440047ac072ff0400444df0d101f0ac09401f09405a03499d8608272678db1da82107a72f66093f55f3b014d4f646124035f29d38b4f023915f29a6122392e01ba6725501f280b6713c985094384a2ec72111215a7240a35894697f742302192416216507a7be0720563820f109791f0720708750047bd8c62f245000849b3a52f31a52a14a16c42b33da3c58d585d6976ab3962205439851440b404501f0d012f02f0be01f04504508b02495a0930b406e2b53250aa2da21742109e2e10d07dc7511772595763a15ce80e3ee88b7f719d5207712f71315125722f28798298807ff87c7401cc4864017f07ef35b9400820a49bd2d09a45a89010e52a43519805be08202a9b4ff0d10940f105a9b40e90900349ad8639250f43a94d00bf4af58c8bd2a24866729ee45d14c8a00124d299762e15006f02b3751f43d99078450e90ce5be0e906a9ac00f08d8be9940c21731740ba21741472f6200f499387f3e737637209b112aa82350dd3659b829b0db7cd37732c46b99019546251832692018c7ec41d9638b1163a4b9836cc8b09e69974a52737a04504633521147d79be0d7940084a1108b01701f01f0178b40b40c20fa82501204512516e4710962833b43b840d1086e27f874d6299024a004b5310a940a4600120b21f43b40d31450b905a0c40c405a03d8550940ec847a5a06c5ba9708250a080a7d343b9b67da1c03c71a15f51c1819ff15d37a6223f818937576460284e5511af8c85c011a1369109fc433883a2185b9685277174b436e48339244749d27d24e17f1c7297990a822400f10149e90b7a3496c5c20010a21120341251b846458d2cd2b20016116165f3356aef9600a941e2800710230af0fe1a50378940b68b684a94504d801a34985045a714732a49b49420f103f69691a2b545908201613b7ae1e365461461e3490681a2a215381ba18a1069b077f3038fc4fc90352954f31f2cc8835694e38a35e26274420820750ab0be0ab08b021090aef0810e10be0210ac04408b0c003405a0340b0025aa50010260127ebaa14300952d76f5a116f41b33e14d5895003bad1524253b3366566ff50f1f436190f0f393b09406a98b0c689308a9d7a4e25e2c200f0da2377b347a7200a301b6ec7611ea1590640b18c18307873875681ee8a593127eaae3183392cc4a1136b3a2309f676444aa4777947d9a42be4c316e67505d98e27401706d8e909da5a0170210b40170249c4024bc1bb62840260a40680d90080dd2b00652510529500016729652d146c256a950c5876a1e4b10850120379710241241e43a7a940a085dabdad7aaa9a503e26e241a851779396a30117da17c7871e20a02ab1ab1261ab485b95b4464543c9f0069a6f3501fa626bc22fc9d67b98a016567476aa7aad6b6e47e4c5261017bab0a086396a957b25aac04d8450e68d1b5a0c008bffab0071022b6807a0a40486a10566b74474351016086353d1435512459b59bb104b5f24900b102eb840bb5710efb1054e2cc1940c20b403e2e2454bc208404d23310b9bd8bc3590e4ba64ba105b5d5e64382f51959673281891e75df6a593e5bfa6b9444ae5c9a36b9649c773a92c0aa9726b64206b39046e42f9837789130361750020f00e21719a08421ac04506dabd8b4059bfdb2a42e23eb030230080943010300910eb69b335809bef5a58df903b5fba0096a310397a946b5a160d12e26c56c550094080ccfb840c046517140b91202f1fa8d34a1aac7fc72187e89eafa212aee8185025bbb9810463e5f11a692a113ab644b61f5964e4bd2541c371c7ff1c3c8d4f69b6be38ca9e04ab0a406d4421b496baac3440170e904400783108ba3e29ab2413ebe26a74d8472bf7706ad27c14a589c213b5fb8002450f7c00f876d1916b62b622b34e22b3505ab3f62f430f171445a44a3f1a34440f100bb892da1e73221ae1b82eeaf189f0b82ab1091c7cdf26fa78a801a03dc462c117138c673a2b98ff18a24404903d7845d6b7243d2951eb20315d25da9406050fca50450d748ab1ac8ab0f1b5a205251034424a102a48c61e1920366d2b800cf9b104fb59b76a1c30a57346a41515879622512e2a945c5a26ddae16e160f1e16f31c2045045a7a7400a30538e07f11171e646bbaf291c215b8ae75feaed30cb3a25f3aeff56117831383b6d255cb664d10820bcb60b874a42704aa431ab214040b9c08210dc10cc8abe168868ab6f08fca261a4452066300d66600b06fb60a5f87b108a090d65ccf95241c346dfd4f94a94c20a6a35d3105005c31e2b62d4d8ab07daa81b9a1a4cb218c13171aeaa829b1f75815223b88203f367dcf300a2ac7c01b91ff8b2583dddcfc94f3c13b7230b935474b20a240198042847438f5751562814c4394000524120590caf0087b270f9dd6a17b62727927353ea50f7900cf9a00f5d65c0245c846d6f7f94bcaf941e2a26e24cbd56de242cdd621054102abd10f0705bacd20952d0f2402635091bf2081902c1ceb4eea4078dc1f50f5bdccdcfdc56ffbfddb1aa715d9440ce4510c666edf748d4a04714951651bd86d20f030cc1dd7491d840953fe94e24e2855617d62b66270116b6a3531c3d5d55c95055002486a0519bddb3ebda265660e4666ef53e7f6d3a451e4cd5e2bd84ea63643841ca114a2696c71b8adb16dcfb9128c824f83c97e38117fa2a1383038fc936bf9a609021909da88d4bf53009204caa3e5107aab1d83b60590c2fd956f43bb3548d00e161ac7f4c2464eebd087f66c563c2353300f4145c1243fb550950cf990e8bd6f7a17589a17a338bde6d8bded74534cd9749401363b9e22d1e409ef3032502c822ddbb408dcb72e3f005e3d81398ddc363e122f333da83d983b645619d9b6a42b3ffed35b06086a3ed16b3783b0f1e43a1da621acb620d16ad897afd4056f4e24b208f4ee7270d87a0e1c3d14df93fbb1095ed58c5e56edb320ab0020a26eeb321e36e66e3c31e264b650f908100355114f35695690f2720540891ab1b5b0819d52fa2fac15610cd55fabfa4a25256a143aa6701733d9c7d92211e3d9f5a74ed4df5fb3db67f7148bb3105ad600ec42ebdd00c628b57ad60c7b5e89ee7a3350d0bd941f2b60ead149946d2bcd5eee70d61fe46e2bce6d4bc3377be786e20bbe91341c23e9834968a25407bb47e802f00c638933fa9bb457801d1e41388d1f376456b81328e9cc3bb108662a74b202666a572f85389eca5e660c5db3fd48adb9e8cff8fc1cb366dac6f946eeead1c38a370d80d90d95e80d3373943944bc4bc4530f746dabd26e74fe0d6539fe3947bec20396d6e0b6100fab738200e10aea09af5154097c3e5681ace981c10591e72223fce9e33221f362cc8d6dee6fa71f1004795605340dc95534fb3f41fb3f2ff2fa169b8fc60261516b5ce7699cfca3301eaad83fd87fe720e30e4fe800f5df3f66a2bd34f49f59f05f6f7051fb663424fe953d1876900b62410740c6edbe83853893d100e102212ce81cf00dbbcb4f96493acebcedd3f8855f4c4f73b2ed8d83daf378dd3d047e69b2416afb3424406e4f166c95f0ef94feba3e8a5a276ad64e45166eb4fe94b6a78fa8f5c3f41f41f1485ffe841197394b5e76a2ef23769f49f237f9f33720f910f872a478649617cdfa4b6000d47740f6322387c7823a6eb4682c81315001a2a34002850906788080b3c243800a0a3c00e01264c9821f0678f074ca48081414b418413044e18c1308313830829103839c944a18515046ec43053d6e20305061438605087261c93148e4060b062c001a6419a8c7963d0c1d907068a0d40910182040b141c68d0952b8200ba57be85da9321028407611020e4c67da55bab6730288bb6fc6a54b31a0869f4e102e4428a280a00a81047008a482e40a822356ac38c75242711b042c1830a479d1090b01914498c7499064038703162ce0d2847960021d26befb1156b3ce040ffe4c119003a3acc5160442ac3930452b44915708fe30c943c27d01cb6e175a3161c472a9631cac9a31e9a051905f86d4defcf8e179ac00feaddad53bcc51b36dd3850bb65efc7ab2fbeecd9f6d3de2842f98041e2840328e5b88408a4e3892a88216a0b0a804142b21e10b043bbc88070a1c8c42341c20b041a2d8435805b18a1200d2a10f531002ae0c5831880e867b20a736a48b49e4259c6460e8a59442c9262fde7bc17522e4843fa8cc13bb1a0928a69a3eebb7ae9a10ac3cb6eada6db8f6baba4b2d29b22b2baca8baca0bcd21ba4f0b2df4a3d2c50fbe4c00f1a6d8224ce3021e48c742c708309c24bac43bcce2cece3b8093c2d403ad6121175b786ff6b7dedc101e4008083053212858b08203126c6089a8a684c1b5a4966c4e69bbe8315e83940c4535dc3dfeab4048260483125a21a4aa5a4bb0fe94b968a3f4e2fa0b4239ac4f051e27c4d23bc03785ea6c44beab900b831cf23150b11b0a4130841f044184822e407033490d2bbcafcb051c21e3ba3b3c0001d2821a6125b61add2d66b64b2a73d121080ba4a30418809009081a2db4b087e2acd43932ea52ce6283964d659523b2d2d02188832e55b8c396283551e85982a57c3c5d6a60a629a4aaaa0dbea0cac18ca237d31639d4f885d2bccd048dc2051695184b482b2c30f0a04b63ed2c4221041b933f1b0e187014837d23b0f2bf121c21c8037d28f1cff0210b0a4d612688535451d8d4083cc1aa4a2931ca8cdef5b456a414cb1a01e45f0e69e4d5905d3579b7b02eaa42e553da9b95ad43aa1fe837ac62c2246304659a845391b24f0eb99395ea86e46b5699385eacba5fa66da2da2562061800fb2540c2152c450b79c6216a8a3158c073cac23be3933277ae924ad8732867fd58718ea65ed31547d1aad519488124012473b4306b964ec171e3878c4985248530555fecb7f68811888d64c110fee66cb960f3064658f459f8dbc29c245485506dbbcfd77fd56d2527ccbdb65720d28768690b98ea60c01322cc981384bc39506a0791b2866e70d029cc76e10548aa10de22a535d07dc53e5b1099eaa50abc65c04ff207cbf750ca10b6b62527831a0325d905588244594fc45a733598a268f24ba8606956697e57c865eb91c910872e498ac104f19c13fdc7e75f2b7f575e17eebccd6586643bcc16e4108a0339050b0f90c0cfc02275300116803e10931d9050091d09488f4a91602804a664bad5708b83a1dd56d0151b9b0adb06367410010654740214e248002408d5ac073eb6b905658784612b4e4547b71e6f2d2f24dfc4c4e671362135a62831c94f07c732b4c5115e3859899bf8e79c2dc56e2277acaf96e6a88331a492050c3b6d89ea43489f9914a21e1022881908520e0c68a9641a7c87687901c63552c02414488ab4e55f28395b0638f2d7964c870243142fc729bfd22f19a293c2c542429456d164e325f631b5b8d07b741b39c10a65841e1ad46d612b5b9d468832b359a58e316952621d49a4462675c66e59f7adc6d71f135805e804084199e40320236ac6e76281e9d1109684b6dd300c5899bc8cea180a1aa5404027bbcd96d843ffb0a534a53cf378010c508283241f480238f32500062313c98c288a03c92b0fe192cf66a0be9313ab15c8267714729a0b34b2b42c4c7860887a35e00f497ae1067ae9c8fc55a5679b15a923a8ff4e76dca66ce3454208593109087001a77c1dc06a695ab004268577204ad3881335007951af4f818092dffc2a65bf0588a28982c7c8ea4a72dc3ea8ac6f1cf3e1f209e39a9a10688684d70f41551ece9e46dd2d696b8d09e353c1a22c8c76089e48c610d4d5ed1e2aab3535dc7295f9c995f35ba9fc8226e037beb995c7210505354210471b400034b304bca52443f582041c418575287091092486c9d9e532804b80c96ad580190a065e55daa4ca47a0b113e1c0009410a00d4de1fc93cd369467f8400a697a5f4ccab5c68d617bc95226adbaf8c7c199c14ae0064bb3909df0797159a9cc3358a9da2959ea23617d2cfe27a559da211e32f9bf5efcf22bced6b02040cdba9a4d809dad5e688ea7647003883002004556ad496597c9645cac4731b9ee8263c8c90840bff1112021048d19b08904096390288cee12559c2ddab9c696f6b7dd24f99f4604eb0e40c9a3146d0851049b1b3e38a20e258f9c20f75a174694076e0a89acfa285485671354204f1c71c045ba7b409c79a0ef36d2845b5bda81913e9009b8cd70c103c5a04b049bac557221c5d6a53a13491a2e56d578aa555a44370c435738c30fa02b103e51fd0132b8e5cca2ee2bee542793de3071afa6f0557bab4e20262c3199c0e6e9696126665e2161b29851e3161b914e498ae15f438f6655dcb43baf2db5000d291aa200e634b21a7cd03c55ea520e0d54318e7ad86d9e9b609484004e8801978407f162290ea885a25090480abbf8eb045a86a53909d8758848c4cffd595e30fde4b66b3d4f15b0fd84df4ee9ce4a73ff59ae63dddf5a60b65e3927125a0416bfa5a2eca91756eb78050b80b178a137a5e6663fc9f30f08c33486c8a76c8666e7054870c76c18610906abe439cc2937dc02974d32b866cf1417fd832d435e9cf0380d36d7810280696e48a71eb64e97f66beb5796ec35b62496f16f4a6ec8da98a0d9e35dd2bc6d0c84e0b021f6d05cc57cc0e3779bf9e34d41cb067cb82e27e6824ae30a813e248a9dbc5f3903fc56de008082ab30119a78643ba166ec21b6b2d91b705cdf86dd45a4b029e608c1a0f12be17f8393e373540d55be5aab4291d2924b98d3a6ef34e9449762b634126cec2a00523e35d3550fa0890ffd28e1bbc954be3fbb5b3876d7519f03cfe1b08f0ce69f717fe0452220400510349dca7cf0c28a3c97eb86f9a14f009cc685249e28e2ee05e609c63984da601d3a16f5e2488930ef2050808136972270b78c147ea3f02c625dbe87f2169ec75f5bf62040794f37f25f2f537b9c73d6865f8f14e25f813bb0a734d9107c15f126123977bc99b70b7875a063b71b522bb28036b5928b24e30d8c336b370850241019b049f011c001939356a8ea9796492d00ebc61b20fbb4283e1f79e881cb990feb5a21f35cb12a3f34234f1a29261cf09cbc00d003a3f906c2090e984103c9091c49142c9a31a75bd2142bbf1ef34001a0300251d088b8a1442aaa38db5b0e4ff86cb683de0531c0006b8b38bb180fd336a134d793a9c78701c8bf0bd3b50a220c3923229b73a9b393c41b36a143b88c32143f6b3209203b117b01041c9416180faf88e1cbc39301fb608b931991f9d9a32b9736c97c342b0e8e90ee3998a08efab423c91faef24a33da4c142bab8c89de0cb072441a82c8c3583f59e4330c900fabe99b7178af8a6baed3edb73b6ba4c0909e524e2ac8f106b3e09700710f3b5ebeba341a34ca1671dbb28048a3637183b3220e3c0734c20cb4b99905a3af3ffa3c9b78683459e43924ab00d36fb27a41a7aae90a00c13d1ba6c5a2f12efa099d7b2d2291423b1ac990f0efb6597290516e8053f29d088cb9f02599a2ee071ff8dda852cdb8bb682704b6bcdba482105634e3c83aa16bbf834ebfc813229b639a63011488ff8111da9143a6193b00021c619e3c07b010b134e9b00d28deba6c9fb1fb5e95c37444fb973cc2de8108a00318b005caa6aa08b62c447a0e4ce12fd89f2d7ccb8a90c287a0be0724199103b1aab084c55c71a1a0eb03ba8d82d8134510579e00f083107c8a319c0e09e5c33af1090437916c36a393e8c5d01889ea808682f22b5aceaf08bd0b203b190829441c74399a614a44cc33c981cf135c18739737cb7f2e92b98b94fea4cab49a08d7b6c27a0c4aefaf1a1000726f2581d70c20ccc3a4fc31c97aa829f7bc1c77322bd9ad9a6543009031a950ccdba8bffff8c796d47107c0c8343c708f180b41793eb2180647d94116baeb2288d8c479ca1dbbba4841804210228abc018073cbcb0014431059424c5aba931fba905c39a2f93753af2372f4bc43d623ab4188903184cc3e90f25ab82ba9abcb61c518890919c1272c600c28208cccde8a9c79c05182c07422be936b8542d24308428754e63ca9a8b1433ca3183a19c8784b48bc8c506ea4a1e529090056e3604969c794d0933a520e2841a3b928d3429c4ec17399a99a614feb87ae1b3c17ca5cb71a22b0ccc4bcfce93e407a802c518b94c9cf3ac1bb4982b5b1dcb11da6a84b0f2189189c4c990810e8099882967a1080983c161a6e805b2231dc31a4000f82ba5397bff4c71b6351838498bc79f0030a30d132909e54a40bdc634f3b041952ed43d8682ab3679da1833a8b1b99332e2e05073bb4bbcf34e8061014c49c49cd181156ab9ec4c3f134515fa3b851ddfc715a2b1c9410b44c9c0c347c614e943180188187c89209280108080c39989e0f1ad1db00818818818c50d4db497901c1ecc1f1bf3ce4cca9aaf7c31a9db900b200d1c05bac09cb5d18836b580de2c83801ac0dc060dc50b4850a98c801ac0b325ba73263b6bc9eac55bacad0e25320eac79b864878ceb0cb27bf15998d105abb4c5b99e4f1b4157554d26fac4b4f2e4819967a77a608b4cb9405df796e4990c9c010928708b28700340520d7d92052881005d0fffa081f1db08c50138e40910800910818a00b4a7fbecc1f974abc2ee424d31ac939e8320aa4762482094865841200f85abb2e2218d5a049ad450a2350419011d9a5248c47938c5889e2fd4733a8b1803b32a9d3c864b3d893f79d3df88b008f4b446ca34479419912a71d7151725153ad3120036aa54dbcba08c9cf7927b273800920d75130520ba5d7dca5520b08818b130cbf71928c5815d810d4da085000f95b96aa190e6437d7154d2959b4a75abdb76503cd8c6d4c5c7c090c218f5d884b00c31213e0080d9eb7bc38890ae8cdd9a54b6b6d4f6bc69692c9517b0734205146ec49c089b00eb4e9c5b5315b9ae930233ad3599a25fa12277a02547b41834ffc600c94800808c4d818da5d759288189d515d6d515592080001a3e9ddde75130808b00e949197984181da112b90521f9a75d17d2dcc93300c2018ce78dd4d8de99094362f8dbe5a9d4c0601232405884708c50605b0c2205092b4b001d150490a53dca1da1c34bed09458c4633e4f0a29c86c96ad9d9ad27bf80f3db44f90814ae441d2fb71541abe4e9a02ae1a3e87f3473e90c9c38deadda5920138818fdd6dda0e4c2ddd4caf32fe2fe21554204ab9191081123ed41887a3da0cce622d4951b2a900df976aa5abed134be5d0d4c019de5d9c08841f5b0c50a0cd801e00b08a79504101bd9e8422663b83da0d5119bcbd87939cd29cfb3f71cfd273c9ca4ffc200e941fb4d57aa9514755ad9cac815453d501609147be1cc94808906bd5d0e0b5eddc06d0637c27bdd89fc7211e00d202402d5a48558bd90841e6833a43006180d90bbf91a5a833cedae3865418b09eed0499010fd0fd17127970529bddc2d0f8cd8c795da1f8df8d580d0df0096dbd83ecc95f34f34818d9599a7e4e3511a4ddb2eecd2fb9082f324a44551a4753a34e52f25061da7f4f12975d13e56c94c94992ed5f71120ddd0c30fa811d90551421e1902cb449386a2e4aecb3129a25a40a8508d99ddc9462c06dc83381e916913093eb5ac064e155a40adc30dfc81cdf1e71b871ab322e588f08ad867ea40970da93b36923ecb3df05bf5cb4f71bcff592ed18b49ccdb4c11a02c3ed31555d199d2686ef2e6adf115295a80ace4db982c92c911a27c743d06ed5811c901e8a7bae9c197f36756450756449a0d788a83969a87e50a0ccc382f08b71880c0d816ce586dd55ea43349c0f1efedc50a4060563473c04957e988a63a9d67622ee8522ef005aebd0d80fb315e7a6826c65e3dbc5b4402c6a531512a2f22f16733e077ad7b621d418a04ed521fe001ee19410d1b77d4c237b5189e04a03f8c1830b3393121c164da26ff541d57359e1c99e0ccc439a40f2a4f585470cbed93336a7d4eed07664e0f56c626d60a47e39a8050e4111776a7634e693a3b318f4ec7ef0515ef3a3949ad9a57e4ef59381865561fff9d42f4cd4272b42557cf110f072457a2b64294212ed11aa26c9c77d594774129fcbba0eb13f02a8b59bbea002da0a43a48f4fb6d281b100879e59dff8e99363be597836bc71619f5cc01d96065b280fdf96801805883888e0c4132fee00a7677e87ee845a69bc328320e71bf5f34ceb89ba1351cf7159c273a2667587276eec52f257a1f935d6ad51021e189a42521ade3a096e321ee0dfaa984106cca08b9cdc51f89cc4b8d088b6cf8c913f07e8e19dc37cc3ab600efaf95d20d20b281b90ce46d8b36dc60ccd3100931e0109bc9e70a646e96f9e30dfe65762094b258824ba7e580aee4aecce19cb35726120bfda1b41c0de926310ef502ceb4c2e1c940ffe406572216098207d41d412f1859029129d19c1157292f3e8518198598be06083d39b04b0508c10ce033f3a8c42645f657cc017453990d20f8852041036226b2d9a5da8b363bd91b196df54279702c1ee967a10cdc01e5229b0f60c88009782fe4134f6d4ea7e3b36ae7fe6268939f63e9711273594f5e99866e28ea9320f5bd7de7fb82355ffe9fe8a512a0ce82e048994a9b9569aa8c08b5f5e03b005b7b04f9231c99221337dfad906a2a92915727f1cb3714421f1b9edb595f3770c51f1b92e260109b8c0d31a011f5984809ebdc1788b579413f044f66805f65a65c8f46fb3893f3c29412041c8ae01ac1b208de311a1867276b5e1a00721620778601ff6521516e2754a7b1be0053e74cf8c089b0387387131599d083b84916692219e010769c674d56b37c9cb37d2842010073258226314ef37484584dc681f3e2663c1ea1f171e085470f66411cac632f6acee84346c882776922287f6ceb57fe473e17dda13dd8d3dcde05fa6464d9fb3573affec5745252b68a09d64a0951542ce91ccf6405aaf0c1428fd29131bd26512e8508b62898a2655fa9b898db0594d35d20a28318a486670ea29bd3793bc252207c8f540d0e6f0b41fd1650cdd8a36578a74f000077abb48c3aecd3b4fb4f6f64ece47e4f8f626625e0dec1bbcdde3e94a446cac773a76aad7b02cb2f572621fe0aa8ae9889e7c84c7b85f32b046948ff3787eb1be8108453267f90557557b37bc521f431ae2e2a7b41c8384b5acd3220e01c098c878cf105051719840a6f1e66a29bff8ff07e317fa7e570b763ecc4f577d97173b1bafea49cfdb15877310a44a7f2e520fbcf10f1ed9190c12be7b69595895595611d7f215ffaf26f0cafba2a2adc133f229c90b36a923fc9982b73b7d20908cd308880a220c0c00603000838a0f0aa05159a2d902161626eb2161b8858f1e082d6470e0e7419709f04c54b09031600c780328146911a340089d1662dca94066e78c9f105c983244ca840901268a012a54f86801284480b04203e2c50a071c4c45d262a0c4d20a5b14a85192c0c7d51600ca7d60d0c0c084b3062caff55b310de8d4bc6720306090eea68408043028ebe7ff206ebd7738202cb1e0769d0983b0aa2ca0414e840575233030a51de2820d065430da99b0861617185050d2a5e4ccc58605081c185090a2c78f184090b461a8070b8c183464f89bc3a30bd9bb4088c7811002748aa512cca413b54dca913b38e4e972e760d1a445b37f01b4d9e587a055a245aa41a0898a051a04503bc935075fa06b0ca851277eabd1060edeef8b379eed510a08808e5d792040206606166892695838689208a4e0f81565713030c6596530b043085076d9996c28617108694870131c6aadb6035c61355235c44311e6ab164a15e249cf6f3cd6c1c845207054cf08c52772d14235c43ff05700d547b4657d3167bd52154525a4159a41c0038352ed87620798ed55ce510924a016689b0c7536e5670c58d61b5965f7361c9f6d4047172c00723060808d36b7e286892860a2890046a080a934d5475d5f9da569d66b1288a58450a16172010100b4c0d24ea5b6cc570f9c41219e833af8f08500c574f1dc84291762927446a8401b83dd29c46e46d190049409486754121ed925018fa84087f41502e179c5a55f5a6546e890f9855f5a070c00712e7b6d20af9c9369c9b6dc92027237e40af88b6f09b4eee0b38d3148e36a8f5af8abaead3af49b4eacb7fc40102304718b31410850c960895b0c208506185961df261a58b0e147079e24ca52459e3c3ff3552f9c90e08506bdc8bb5d86ae74a3654615907c11990db6104b060937d14523b6d4f10575be907d105bb6fa73b0b73b7795687055977c2a7a515075975a9da016e3ba99c5a69b9b00c5cfd85e478bbfd107fc10cf9fb144017eee032c80d5b7de577d6e69b8e27d7ee7d7ea61b30616fcebb008bc0878bf9e7e474d0222c90fd469e9cbc1b41ba1433911f928a2aef85aa7483a74b32175210020c3e193a4a2fb43d540d23e4e27ccb3d90250eacdddc45afa120690e5fc03c1b35579bedb7cc285b91d7869a507f0067b1025fde608d3abbeed9d654e601d0ce0d1ee0080abafce0af4309678d7e6ab6fc9dd538db3c507e245a501c5046607f40b0861bfff18baf54d40361d126165870d2ba601324d016ab2770e28114283042cf021de6e367c6589a42c302298c84624a4e0c6e526428fd29c50431d9ce4872748a9967eb3a49c914024775a3dd1bab4a59f25500a52f941c20ae3418faccea671711890cc004eb608d3a10e3bb081fce1a99b0861ec2ac3b78928e56db11c504c69cb0204f8b6320040f0101f248a02144309a2d86fab7500cfcc9ca599174d0c0502f089c5a85360948861712213a8dcfa631aa708e6845e08c50a1371130c8511246ab139800027ca1108e0e0279bbc96e2f85b2418f4282ab2d5d77c75fba4a80bea4f497a860538e518f43be386083a13d65020bad9907c7eb3ae9fc001a948affce028071860c6da10270712621a2a94322f0770270122c0b59344226b23762c2d5580850ad3a4ec9e05c698a93d0b0ed320800a307236f171b5340818837037590418df863a3acdce6e10350f8d2ec2046c00a94470a304e04e052a288e0e1565e2ba4030150c74fc9058822ca90ea317671cf9579495ae9ea0d33c2f8cb7ece42902ca461c4b2844808c0001238082216393c3aede0a004db110210687ac78e62d7650d98a0419010504c4410a840804c026025092801820891449588d282cd09a039040859e278b8829e2a3720089332033be77f3b0c07ef788b33ea1f70a3ab6a5484524ae6600ab8593791cca6289b50630d949e4e5901a28248f5545bff285848141bc40418a0c554d374374680de966a84680de6eb3aac5063a010808818dab6d182c510151ca0264b0a07dbb2e570a205910047da00d08ed5daac6df8e30e70120a0c5b6a5299a39468f392ccc851c50e09d459c8b9a09a45bce12d1032444c99219ff9ef67a864f8cf4546520b0c414b9bd4008a062797c52d2579ab7ce98412b33490d5ece75fd1d2d1b6d3be131ca0a20ec20b017dd49206a5dee34d00a041b0b4b6d018812602689ee479dac757ba5753917dcb2067facd5130f57ab2586b674f3a7583fe51040250800c0e8b002bb446e2492cbd90c050c25584276b93746dac4154531710d6c214f3b66e4dc8e198182ee700ad0aa05193baffd9c9ca03773995d48926c4537e90ca01387a24087565d8ae774853e98a475b38a59ea017fb21793eae7896b91e016563ac759ea477ab436aee47b315dd6beb5ffa2488a42be20238b04455b422e3b8902608a371a772402504fe51e217585f2263d2971d0446a1b5bbeed400b0b48f445280013d28456bb870959d34c80440ad0dfe3b93dedcd864b5ad0a66445b40c0cdc4494339f6666962b4d8e8b0c50d4d706a35b3d16a290b6daa411d4f65b2d142a1760c2e434e6a521b961af865060c1d5f2573711d59082127c138e48404801306b672090d1c3a1c068c9083c0ca910a58b6560013558d00b0610938c00208a0938d04e0058310b2049f10be54d9ff4d210199c082b5eb371fe9614cc7c48d8b4112f258d0a99561f370c7aae7f9d0a264c7313093b53d22828ff5a670877e80440e30d20d3bf7d62ade97347a9a7b21a4a3b3cbe4c29592b4222daa798ba062fa885048c26a4ba5ec341035b414909b092c41490a4052365520e9e81c50cb2a10d0c2c33ec08c14e0430270a003041355839f9c730527e70acf4e02fd0cdaf5e0c618d0bd50f00d548a34a7e1189d549d900667ebca5dd3c2840c309eb9671575354d7c52d5b8fdc794524e721925dd4f100d425df0e73832a48f4da90451aa63fec108a45cc494367715a6afcd18a03cc466e3180625285314e7721bc3bc2031b708b7614bc17de380f10ca089ffb248c5cf0a40f38d0f8b7a0010de5e0600a9612ca0e3e1cec1842b4e82f06b9cb5e7277096ef4ecf8c24cc9908000638cb41748920ec5c08408ddd21ebcc6ac0799d2e5e31489bfb30926e0949e5bfe3bb0899c6e9af07a4085f33ef62745e61918d527709a45406d1439ef6bc4e1b4da03dacc9748b5d68d0d15d9aee63b4251ba40deeea5954addefe969af890cbef0070801060c2081c16700930e7460610c209428c7801ceabccf730c2fa2ccf57ed6e9006bc561031416031848420c20c51821c8791f0f2d4bceadfc1506eb08b80c861c70c3482d571d940b613d17a0bc0765df80816c0189f80f686485141fd7487d12f994000ca6d240c4872872cff3fdad1bc8f7df9d20d6e0f111101146fd498c25b35bf986c0d88fda7089c66417d1c15ad1d050c96d444e2065dca1518ea18c18c59516129ed7c526c7e5614e0031010e81a816510f30464510816e0492840c51c41087d80061cd34eec46cfc5e0020446c3bd0d1b0ca416615b52d5139611b60661bc40a5444906dfcd64915f6c6409b105d9b1c0aab13787283f1d4cd405fdb65cc0f4090001ad6915402935087c88c1cc7982b81dc668fd99fd32150080c30821c41011050c21c21842d210612f308c9d2660c0109ed61e160f30f38ffd8121028e910a20031036031446490c51c475c05200c94d503b5464c75e2179d2141d589d04800c63e6195b513531f750ec34452cfe196d90e1e8d88a1993e2890fff54269cc2f5218d06a68c48235474bdd6e4e4076d301eac359c29598121b0890861421e2bc9701dc990c589f5d7ca0c30c518e2090c118610d2e20cc228c1e2a1ac2084e10bd60492cfa503e7e926491a00eff57e913674efa5742c3c72433ac0c804cb8dbce740803bdc4a50ec906025ac4bdb60ee53d92d1e99806085b996cc8a4a02f4528d1f19409ac615ee9d1da38724408720474f998313946e435df4c6851a5cd59e482e5f09848f98fd560279a902c1a50b04342a04904210fcda0051c94aef1510510d5c014610f3c01c208fadfadf2a03a00231c7e5106036a12a24c14c34e0036051c720808810d04c05cd8bedd12536d4ec9061421c704af0c6ff4c11e7573183ac4d73545276933da3ee6ce68500df0e8cf64b02b3638d009a6c70452ec4ced8c40e0ec4820dd36bd91107e0674652590dd18744a085eddd216c54a5030c1084bca9cce01dd51870c720a080c421c72c70c51230840c1180180cccf5618204210a000b146481ad22ac103223e7ed7e123e87651c218510c30a0870010c90056e27a12004d804108bdcd5cdbcfc5f5c366361cd80c01ddd7573e140bfcc1dc06294cf0769524078932e64e6c0f9a15e20ffcf450fdffcb32485bb525547ce0ebc4bd90a557c11c305749722b3169069c458f6ef6e658ce4a5417e4bc076e7c000b0881c72cc82a08b0cc86908618ca133e5109042184e5e0480ff834e200cad60861077a00661c2147ed60c40840851841c728d8210c728704b2e091028c18d7a08c432fa553ad46799618e283741441447114c427018a18abbd7048199acf495dd862df432ea3a96538927cd9e144b62c69bc478230d70478a30111872ed65ec098abf1d050d875a8fd21a858a5017a4b43ed58030c5b8a01c04c0080cc828086a280c49d41430a21812c304c00b00c301b9210a7534e979a71b08f297fc46ae208088848884758a1408e2c518624d866aa81069a6d8e38084e5cc42e12204eb4f7e0d9514cacb6802a256f42e9da9ee4428ab96844544e306d148aa3a90e7d5256bac278e9ecacf916e8f9a8ba390f3277c65612db0dddd1cffc2b051907e00c104e00cb617e17ab94108c592106aea4a3463cde184c15794c921493c4758a91208aa12c92812c5282ce2ce5281281244951cee8d045741c30110cae7284181f88b8e3cd38c46e7ae763bd4aad4e21819a4cc6ac3c825a9cc148e9d665d49b921819158b52ec96e44c28170805d24019029ca3068e8313598bacfce4cbdd0a680845582e35821d5582a207a99c855a54cb24de85aa5c858c145f8c55a7d97d4144c58a58a5b5d0c2e81d088100ca1ca3c69da3c28a68a58d6b4a671218618a2480c118b1a6ca8b8dbcd54f54792e1e36e4aa8ce0c4218b0c5626a0182e923406e4dbd7046c87c8c805be0f152ca0e7c0e451895007ba240b6ff4348e40581da430dd669319b605465a5590bcbf1d0d5f88fd1c4768958a8ebbaae61764a6b8d1081087297dc50881834eebe74547da59111aa1e5926a8186388de8d27de475b461f4f05d552c0b08510faab4a920dda92cd5460cc464fe0b6d4692060a514524d115eeafc73e9c4b0ca9e66196a7c08485d590caaccc2740a6a8cc1e873ed9273eacebb5622e4ce1130dd6a574e66c00778eb9598fcc79c72df627685a9a504d63e1b8ab98e780f890c9b4049218e2841cae5308a5d541458c0c9b867573c049262d00d0473470f800d0404d80401c80892c80430cd3c864920610c304086c667a6188bc40cf5460c3666951b67f87f0b00a042d1c609920eff2f46194e95ccc4487c0c84b15e345ba8fa308514afed688a4b3e0ea73ec11d40470bcac4dc3e7fee4ca3893171739ce3a7e6770b7512986c8e2a8edd5aea4bcbb2cb2271c94b090f47d86290bc0c42c4fa4ee6b29c1ca251f26219175f89f8ad0458e3c500e0992861cd38e3434578c8b01cc3fefcd4f2fa57965f260621452870c25641fd96131294294e36648c9296d4ba9facc6af27ddc9d8a84ea73e4e86a0c64e95b0868aa9acc0a0ce44e327ec0d6745813ab697098892e2a6108bbe5844dab8ab500ccb175fcb0161c0d55099f061cb0cb04308e34bd8d38c1ef58928920364672a20633a289201cc33f50cb0861cb009b4e0db0c9b88b0bb4dad32ff7d071b2a0161051c9006006045e6a886a8c37f03e99298e4c418644ffcd648c818131b74c4d51102fd6ba4176a034829c15918ae9530171b347e48390674efed69a358e62deab2a8600ba5810f076a134d00c824db1711967d5045dee0861c404a121c4633a24260f9048c60063fe98924924e09d3093393fab86334f093bd347cedde608e721bec985fe0dd214214708700608094bfc270f036a814cbb5da47b504f74c41000daa8a062e47d105141fba814f99d47c73d47c251e3b61b93530dc65d277740bc354dd904aab285e950b894aacf5a1327db58958ad024111db2d621618204510a24920e011acd58d5836c364e00a24c4bac592cd7e233e4be3ff406751892ce0cb00f05bdc3f6e5eeadfa91ac4a2dc154a61ca3010c2575b52ddb682b2f0bafccf2a0c4397c8444b199f26d174052431b22eb0e140836a6fc02addfdc247570a0c61f343d2fbd5ef61a10b41a6fc8ae891b76cde89f5b94b8d854b0513f24111d57bcea0a49288bc36716846474626b2bde981239d00f8e38380a2c33393b7d0a4bdd6dadf50f7a0c8a0f15725be04c3f94c9c8a2b995b4051f45b723dfcb9682fe41ff0d96e6ba88d37b60bccb44b0824776e6237ec904c27713713dc0a3d44354750d59434904a96078386c78b76c9589f9b94f70f7088ce054f07d8111610bd4b0dfaac98e501ace747c6fe89dcb088bcb0401cb0cd343fffed477d045061892030cdd28c1d038c1fd67f861051c118d7fa6ee7f6fa2d934051b62a723074c6b848e4db6f96622a5d1a5e9bd410ace147b84e99f75517ccca3ccc448f3436891770128eccd13a1650a7064f91b42147bce0660c9895cad4f05f0901d56f9b09337d45f4a8f9bca2d1af5634f4cbc46b63bcb04f87d01119bcdbcd16053fa118ca33a09297708d9180aa2fbace73077617d455937b5840f8411411090074018b55300590042a35ba64231a8047c73d85b18a626f48a9fcc8483b9b51868d05c17f05855598691f1ccab22b3d7c21e887ee847b3dcb171f4f53adcb04e137d4f4b9d04fca25ab0e130199bc6d0533200a245632f08dc01961ff443308c0baa33e0360e2937af63d35b135cbb623351fcabca740187844b19e49c9e865df0c8c5352130e4b8835b01b19899bbd9a93f48343b9f7412e5401121fcc8e69742bf2b4668d9f000801c988f4eec4a5f701c44bf9297d8c1c8370152abd30e17abc6d89c37d8abcd34f50f8bcb40a3adc0157802a8ab35f26a72c056ad914ec0ee89908a08e283b23443d60ba753191ddca21b3e6bafba7b2e6b2c489ce71d24452c5e42432353c4b6f57c1144877d33c7f4cfa3050c30b5fdccb3d7fd7838f1d9bd7c179007e97b8dbdf03362144962d6c220c368f4748820812bfaa8b0200bb8928edfd307282a30a3dcf01d508fbcdb8d54ed6ed286bf7e210b0ff01106040048dd0516bd56dba0db3e33fce90cb672e8d4d4bae4ddf8fbb418df4a6a50c151148f16857c49c489dd5a451bbd1110fa3faf7dff48689b9f8e8350b00fe39895504a04ac8f1d74d700e57587583dee3d373c58a09e5fcd7f533f8ab8384fdf1888b001d9d0bc3ad49bf01990f133c71ec3ce160eecf700608d95d1148d995144c45ded7f6f737e7440eb307cd60c9264c43d5bea3e531ca73cc2fd0445a4fd00440800d1a5c78f0114545ae0d160678f08205c90f472e8c98887112244a87488011b213428480132390404203090b8b07182c50d2a5c4058205046ecc5173754a850b2c0ca81030c0c085030476a8412418e28605167c5004f410ff57b8af474c88d1f26745dd1b5dae65faf5faac9fa559ce88608562c4060c0214e040e6374cd90b08e2695094e4870c0a347cf300f75080c0059208a01c785021861b071f2438f1e48507039d10527042e741970c183c30b0f3c14e2b29b62390b061a40a82152c373468fa550102cd12245aadc0320146878324b828f073e44b87288b5cc841b3a51b21234e8c0184e42b0810345250a0a5ca3d4de50a10ec41ed37efc0a3065c2841d3f7ea0eeb21aac091359c66dead51c6d7ea2fbc20a20863d2bd8bf6bda40810ab618520b852428f46faf78f200408fbc0b9d8087d4022cc2c18e38588023822a92840ac82bf1c28dca3b22e3cc58212dc18f16a8706ff5b5de189260a3c67bdd01b1ca1b3880b1ca1af06d18883a2ea83d8e834ec326ec9b0105a52ba3a0262d26bb20650a0e6afecbb1ae722accbc967a0aeb330a006ae2811ad3a12aae64ba022babfcaa637dcd1ce1fa8c243baa3b2daefcda7b4f460a41201b0d20fafb4700060dfb0001882ca09741ce535843c7c222b4c29ac82570c20dc833fc42bc544b2de4b711586da3097c642086c68a6318c7b5c013fdc1a5788be848c95f83e829b5e26842f9b9e820aec52be46ace4625faa426f624a4bcee272e98cbe925860a106fe927fed3433801b4ec8fcdcca4f92baaa7a6b24b6105ba496b0ea7b278107ea205b022800c06fa1470d7071de041a9d60335dffe5d0b026cc0232e40f014c2d0356de3ba47541174c7154d91d64a032064d53284023ca748cc22222e83188812784d8836e869b6ec9b422a39e852bec40cea00d26ac20c48b9ab392b083ac00b93d3d987ad967e510ad206526fcd3a18a5a3dbd9fedc028c28ae2031a10b7c08b3b4160efb37918579d590a3850d0dea9152c4fdb15347cc13e0f4b94723bcc25dca4821f700d45c7bf78dce5c21c280027b915f65491a80555d0f0b6ca388883ee8b36f8f3632d325e44a19488d57a361858be08506f5692172ccf8d1a87a3f87ac9a7a0d59a99c480a1aae64604d357231d404e869338e598bb8afec4b2186bed250270107ddf3398da91c24f1c70324cdcffedbd6f55809fc0f38fd0223114b1833bdce1822e0e4b31e11d5481fe6ad07b3552644b1a5c458e045848e130e822f488832483a578b3244e323486c348426a3e5356167a4a29ac99a20b2800e77e82e314a459ab4c3130c201c4850a94ceed3ee98a8b74a2dd8b0850560e4911c89286038a043028296917d206d2c69408e92e2302ab861850740c001a470ef02497d863d289154062411ba11fbc12fb13bd780b76501116a433f63ced466889f068ddd6029b94498fe981085c0bac45aaa7c0cae40420e81904654b22c5ca293cc1429012f7038e555e0d8b28899ffa20a93f9c7e8186e9d98c1d00b08a32d58475ab0a9c0060ee9e3a018a5e498d9b40a4ff77411aa56c5a69001c5404d7a50861014408f7c42d0510080100ac7a7b9dceba126b16cc68e7364041850088963a4c019446db25688644a4c5d85f015bb988126c6443a92adb874e097c417e806906f5bfa224114c92e69332b6c1ef2a34189c10b862efbff94926625a3a469482d31f99fcec357460e201f8e04a94c46520388d990a2051031c93920769600186003101a8a54d25248b8eeed2a2c5200ae30d5b60938ef2209ad4aa407d827d4e8c781119c44f821658bcc96833d99be5866237a9228b2353f38fb93c4c705c2cc64f3933258c34e30e20c8d61b32d19320719834422e8cfe656cc018014808f3ae0a13856d9efd494d889ba3253918c5a2fffcdc4b95dca36978e24ca03589a102708a1301483491f4b3948a2cba922777ff140420a77450228708f2bf4e7a52d03f4cb5a7f812d89559f054920b9c0a8c233dbdc85f2a70223dc302f1aa1385c23202f8b112a669a8aa480eef6e32418b0c508209f51ec4a68b029a473252de8029290035818014a343d0694968545ab9c355c37e9eeca3f666740a00567ac0c3f8d1de8b0cc29a6dd977a676c3b48308471c617775d475f9ee9a5bea61a8f9081449d0b033633fdeb878ab4841a04da1a158ebd844f00fc4c551ae089286f698c82a05b0aa85321c85cac7d891cc74150be809a82f076bae8071d4a6c9f22b4b4a6c49044656a9fbac533d6a2ca99076ff3b427c2a8974b985af90d528a3ad7d6b6b48b61e4418fa690640fde619a086b4d58a072887575f14f5d34941912489ed8077025e328c95d978cdf1001354490ccc882356184ea7ac9bc03911f55c651a88552c26b9c5c8d60cb6197881611be8d29e16765a8b03a8442003d8c2c08a0cb2a9ed4ff780c5d2a6fb4174a6a359a90f454a08ea63085b8080bcc0e001289a65b540c60e6bce277db0368ef09167daf9c8985a07bc7e441c5af4cb8cd55a3069bb037ee3451a4203d850cea9a1626c27f64bc24368712816f15a4f30003b5940693e85b24a735a3c96ce4addb54e8f2fa69969dce8498a9ffdb3e770b42adf98b3348a5e30372404ca6e4c18f67aff10408ca530bbb00ddadbc079c0838577318b7621c50400249f3a14cb5701ed855d44dd0957c7ab93ba14e744acf09245d622271176849876011b8c9b67d6d400203154d8ee8a6cab92c4e83895854e037c329c9f131747114632981fdb0308f2297a394e436395a4141cfa69618a39cfab3bd9f3921aba95d90085bca330808c0460e48e0f40c3cd1ebb388fc37308e2cd2b06d1a71000525dc6ceb035cc162cd2ee26a970d61cea8da049092cc5b33e995521161ab0381d41e2caaa1808de649aaa5a9bb63b8ee8d11050f01696212428965ec4abd714e06290ccb26432391bc8af6cecc7b62cca057a724720e35f9ad0cc084872043056f2bf9072e8005b4373cfaad6f31e9bec5d07ca618ca0fe23411b54e694cb5ed478365fbb3bb9712696356aad826782904a0ade2d4b8c54d8f924040000b3
// </COVER>

