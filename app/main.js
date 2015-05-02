var Maze   = require("./libs/maze");
var $ 	   = require("jquery");

var maze = new Maze(10,10);
maze.grid.forEach(function(row, index)
{
	var rowId = 'row'+index;
	$("#maze-container").append('<div id="'+rowId+'" class="row"></div>');	
	
	row.forEach(function(cell)
	{
		var cellId = 'cell' + cell.x + cell.y;
		$("#"+rowId).append('<div id="'+cellId+'" class="cell"></div>');	
		
		console.log(cell.walls);			
		if(cell.walls.up)
			$("#"+cellId).addClass("wtop");		
		
		if(cell.walls.down)
			$("#"+cellId).addClass("wbottom");		
		
		if(cell.walls.left)
			$("#"+cellId).addClass("wleft");
		
		if(cell.walls.right)
			$("#"+cellId).addClass("wright");
			
	});

	$("#maze-container").append('</div>');	

});
