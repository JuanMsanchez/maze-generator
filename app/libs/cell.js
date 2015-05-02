var _ 	   = require('underscore');
var debug  = { info: require('debug')('maze:cell:info'), error: require('debug')('maze:cell:error'), verbose: require('debug')('maze:cell:verbose') };

var _availableMovements = ['up','down','left','right'];

function cell(coords, limits)
{
  debug.info("new cell instance for x:%s, y:%s",coords[0],coords[1]);	
  
  this.x = coords[0];
  this.y = coords[1];
  this.limits = { x: limits[0], y: limits[1] };
  this.visited = false;
  this.walls = { up: true, down: true, left: true, right: true };
  this.start = false;
  this.end   = false;
  this.adjacentCells = this.getAdjacentCells();
}

cell.prototype.getAdjacentCells = function()
{
	debug.info("getting adjacent cells for cell x: %s, y: %s", this.x, this.y);
	var self = this;
	var adjacentCells = [];
	
	_availableMovements.forEach(function(position)
	{
		var cell = self.move(position);
		if(cell)
			adjacentCells.push(cell);
	});

	return adjacentCells;
}

cell.prototype.move = function( position )
{
	debug.info("moving cell %s", position);
	var move = {}
	
	switch(position)
	{
		case 'up':
			move = {x: -1, y: 0};
			break;		
		case 'down':
			move = {x: 1, y: 0};
			break;
		case 'left':
			move = {x: 0, y: -1};
			break;
		case 'right':
			move = {x: 0, y: 1};
			break;	
	}

	var x = this.x + move.x;
	var y = this.y + move.y;

	if( ( x < 0 || x > ( this.limits.x - 1) ) || ( y < 0 || y > ( this.limits.y - 1) ) )
		return null;
	else
		return {x: x, y: y, position: position};
}

cell.prototype.opossitePosition = function( position )
{

	switch(position)
	{
		case 'up':
			opossitePosition = 'down';
			break;		
		case 'down':
			opossitePosition = 'up';
			break;
		case 'left':
			opossitePosition = 'right';
			break;
		case 'right':
			opossitePosition = 'left';
			break;	
	}

	return opossitePosition;
}

module.exports = cell;
