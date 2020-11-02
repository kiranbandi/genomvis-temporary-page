function Wear(r, g, b, op) {
	this.condensedWear;
	this.zoomedWear;
	this.r = r;
	this.g = g;
	this.b = b;
	this.opacity = op;

	// uses moment.js library
	this.timestamp = moment();
}

// TODO: function that changes opacity based on time
// TODO: function to set opacity to zero  

Wear.prototype.setCondDrawParams = function(left, top, w, h) {
	this.condensedWear = new DrawParams(left, top, w, h);
};

Wear.prototype.setZoomDrawParams = function(left, top, w, h) {
	this.zoomedWear = new DrawParams(left, top, w, h);
};


Wear.prototype.drawWear = function(x,y) {
	noStroke();
	fill(this.r, this.b, this.g, this.opacity);
	rect(this.zoomedWear.left, this.zoomedWear.top, 
		 this.zoomedWear.width, this.zoomedWear.height);
	
	rect(this.condensedWear.left + x, this.condensedWear.top + y + 43, 
		 this.condensedWear.width, this.condensedWear.height);
};

// Prints timestamp
Wear.prototype.toString = function() {
	var toPrint = "RW Timestamp: " + this.timestamp;
	return toPrint;
};