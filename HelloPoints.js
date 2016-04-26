var VSHADER_SOURCE = 
'attribute vec4 a_Position;'+
'void main()'+
'{'+
	'gl_Position = a_Position;'+
	'gl_PointSize = 10.0;'+
'}';

var FSHADER_SOURCE =
'precision mediump float;'+
'uniform vec4 u_FragColor;'+
'void main()'+
'{'+
	'gl_FragColor = u_FragColor;'+
'}';

function main()
{
	var canvas = document.getElementById("webgl");
	var gl = getWebGLContext(canvas);
	if(!gl)
	{
		console.log("fail");
		return;
	}
	if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE))
	{
		console.log("fail");
		return;
	}
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position<0)
	{
		console.log("fail");
		return;
	}
	var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
	if(!u_FragColor)
	{
		console.log('fail');
		return;
	}
	canvas.onmousedown = function(ev){click(ev,gl,canvas,a_Position,u_FragColor);};
	gl.vertexAttrib3f(a_Position,0.0,0.0,0.0);
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	//gl.drawArrays(gl.POINTS,0,1);
}

var g_points=[];
var g_colors=[];
function click(ev,gl,canvas,a_Position,u_FragColor)
{
	var x = ev.clientX;
	var y = ev.clientY;
	var rect = ev.target.getBoundingClientRect();
	
	x = ((x-rect.left)-canvas.height/2)/(canvas.height/2);
	y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
	
	g_points.push([x,y]);
	
	if(x>=0.0 && y>=0.0)
	{
		g_colors.push([1.0,0.0,0.0,1.0]);
	}
	else if(x<0.0 && y<0.0)
	{
		g_colors.push([0.0,1.0,0.0,1.0]);
	}
	else {g_colors.push([1.0,1.0,1.0,1.0]);}
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	for(var i=0;i<g_points.length;i++)
	{
		var xy = g_points[i];
		gl.vertexAttrib3f(a_Position,xy[0],xy[1],0.0);
		var rgba = g_colors[i];
		gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3]);
		gl.drawArrays(gl.POINTS,0,1);
	}
}
