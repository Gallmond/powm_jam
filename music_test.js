// title:  game title
// author: game developer
// desc:   short description
// script: js

var t=0
var x=96
var y=24
var music_started = false

function TIC()
{
	if(btn(0))y--
	if(btn(1))y++
	if(btn(2))x--
	if(btn(3))x++
	cls(13)
	spr(1+((t%60)/30|0)*2,x,y,14,3,0,0,2,2)
	print("HELLO WORLD!",84,84)
	print("music_started: " + String(music_started),5,5,1);
	t++
	if(!music_started){
		if(time()>1000){
			// music [track=-1] [frame=-1] [row=-1] [loop=true] [sustain=false]
			music(0,-1,-1,false,false)
			music_started = true;
		}
	}
}

// <TILES>
// 001:eccccccccc888888caaaaaaaca888888cacccccccacc0ccccacc0ccccacc0ccc
// 002:ccccceee8888cceeaaaa0cee888a0ceeccca0ccc0cca0c0c0cca0c0c0cca0c0c
// 003:eccccccccc888888caaaaaaaca888888cacccccccacccccccacc0ccccacc0ccc
// 004:ccccceee8888cceeaaaa0cee888a0ceeccca0cccccca0c0c0cca0c0c0cca0c0c
// 017:cacccccccaaaaaaacaaacaaacaaaaccccaaaaaaac8888888cc000cccecccccec
// 018:ccca00ccaaaa0ccecaaa0ceeaaaa0ceeaaaa0cee8888ccee000cceeecccceeee
// 019:cacccccccaaaaaaacaaacaaacaaaaccccaaaaaaac8888888cc000cccecccccec
// 020:ccca00ccaaaa0ccecaaa0ceeaaaa0ceeaaaa0cee8888ccee000cceeecccceeee
// </TILES>

// <WAVES>
// 000:00000000ffffffff00000000ffffffff
// 001:0123456789abcdeffedcba9876543210
// 002:0123456789abcdef0123456789abcdef
// </WAVES>

// <SFX>
// 000:010001000100010001000100010001000100010001000100010001000100010001000100010001000100010001000100010001000100010001000100304000000000
// </SFX>

// <PATTERNS>
// 000:400006000000500006000000600006000000700006000000800006000000900006000000a00006000000b00006000000c00006000000d00006000000e00006000000f00006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </PATTERNS>

// <TRACKS>
// 000:100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008200
// </TRACKS>

// <PALETTE>
// 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
// </PALETTE>

