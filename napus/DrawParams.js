
function DrawParams(left, top, width, height) {
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
}

DrawParams.prototype.setDrawParams = function(left, top, width, height) {
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
};

DrawParams.prototype.setLeft = function(left) {
	this.left = left;
};

DrawParams.prototype.setTop = function(top) {
	this.top = top;
};

DrawParams.prototype.setWidth = function(w) {
	this.width = w;
};

DrawParams.prototype.setHeight = function(h) {
	this.height = h;
};

DrawParams.prototype.getLeft = function() {
	return this.left;
};

DrawParams.prototype.getTop = function () {
	return this.top;
};

DrawParams.prototype.getWidth = function() {
	return this.width;
};

DrawParams.prototype.getHeight = function() {
	return this.height;
};

DrawParams.prototype.toString = function() {
	var text = "DRAWPARAMS -> left: " + this.left + " | top: " + this.top + " | width: " + this.width + " | height: " + this.height;
	console.log(text);	
};