var Random = require('random-js');
var random = new Random(Random.engines.mt19937().autoSeed());
var _ 	   = require('underscore');
var debug  = { info: require('debug')('maze:info'), error: require('debug')('maze:error'), verbose: require('debug')('maze:verbose') };

var Cell  = require('./cell');

function maze(x, y)
{
	this.size = { x: x, y: y, total: x * y };
	this.startCell = this.getStartCell();
	this.endCell 	= this.getEndCell();
	this.grid 		= this.getGrid();

	this.generateMaze();
}

maze.prototype.getStartCell = function()
{
	debug.info("generating starting cell");

	do{
		var x = random.integer( 0, this.size.x );
		var y = random.integer( 0, this.size.y );
		debug.verbose("generating random cell values x:%s , y:%s", x, y );
	}while( x > 0 && y > 0);

	var cell = new Cell( [x,y], [this.size.x, this.size.y]);
	
	debug.info("starting cell generated: {x:%s, y:%s}", cell.x, cell.y);
	return cell;
}

maze.prototype.getEndCell = function()
{
	debug.info("generating the ending cell");	

	var forbiddenCells = this.startCell.adjacentCells;

	do{
		var x = random.integer( 0, this.size.x );
		var y = random.integer( 0, this.size.y );
		debug.verbose("generating random cell values x:%s , y:%s", x, y );
	}while( _.filter(forbiddenCells,function(cell){ return (cell.x == x && cell.y == y); }).length > 0 );

	var cell = new Cell( [x,y], [this.size.x, this.size.y]);
		
	debug.info("ending cell generated: {x:%s, y:%s}", cell.x, cell.y);
	return cell;
}

maze.prototype.getGrid = function()
{
	debug.info("generating grid");
	var self = this;
	var grid = [];

	for( x = 0; x < self.size.x; x++ )
	{
		grid[x] = [];

		for( y = 0; y < self.size.y; y++ )	
		{
			grid[x][y] = new Cell( [x,y], [self.size.x, self.size.y]); ;
		}
	}
	
	return grid;
}

maze.prototype.generateMaze = function()
{
	var self = this;

	var totalCells   	  = self.size.total;
	var visitedCellsCount = 0;
	var visitedCells 	  = [];	
	var currentCell 	  = self.grid[self.startCell.x][self.startCell.y];

	//visit the starting cell
	currentCell.visited = true;
	visitedCellsCount++;
	visitedCells.push( currentCell );

	do{
		var adjacentCells = currentCell.adjacentCells;

		var nonVisitedCells = _.filter(adjacentCells, function(cell)
		{	
			return self.grid[cell.x][cell.y].visited == false;
		});

		if(nonVisitedCells.length > 0)
		{
			var cell = random.pick(nonVisitedCells);
			debug.verbose("visiting cell x:%s, y:%s", cell.x, cell.y);
			self.grid[cell.x][cell.y].visited = true;
			
			currentCell.walls[ cell.position ] = false;
			self.grid[cell.x][cell.y].walls[ currentCell.opossitePosition(cell.position) ] = false;

			currentCell = self.grid[cell.x][cell.y];
			visitedCells.push( currentCell );
			visitedCellsCount++;
			debug.verbose("cells visited: %s", visitedCells.length);
		}
		else
		{
			currentCell = visitedCells.pop();
			debug.verbose("all adjacent cells visited, pop out the last one x:%s, y:%s", currentCell.x, currentCell.y);
		}

	}while( totalCells > visitedCellsCount );
	
	debug.verbose("all cells visited!!!");
}

module.exports = maze;
