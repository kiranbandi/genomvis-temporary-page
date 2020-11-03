/* Gene Class
 * Constructor Params:
 *  newStart - int
 *  newEnd   - int
 *  newName  - string
 *  newOdd   - boolean
*/
function Gene(newStart, newEnd, newName, newOdd) {
  this.start = newStart;
  this.end = newEnd;
  this.name = newName;
  this.odd = newOdd;
  this.x1;        // float
  this.x2;        // float
  this.top;
  this.point1;
  this.w;
  this.h;

  this.mrnas = []; // <MRNA>
  this.cdss = [];  // <CDS>
  this.exons = []; // <Exon>
}

Gene.prototype.setDrawParams = function(left, top, w, h, max) {
  this.top = top;
  this.h = h;
  this.x1 = (this.start/max) * w;
  this.x2 = (this.end/max) * w;
  this.point1 = left + this.x1;
  this.w = this.x2 - this.x1;
};

/* drawGene(float left, float top, float w, float h, float max)
 *  -> Draws the Gene
 * params: left - leftmost point
 *       top  - topmost point
 *       w    - width of the chromosome
 *       h    - height of the chromosome
 *       max  - max position of the chrom gene is 'in'
 * returns: nothing - void funct
*/
Gene.prototype.drawGene = function() {
  // calculate x position within bounding rect
  // start/max = fraction -> fraction * w = starting position relative to size of chrom
  // end/max = fraction -> sam as above but for ending pos of gene in chrom
  if (this.odd) {
    fill(0,255,0);
  } else {
    fill(0,255,0);
  }
  noStroke();
  rect(this.point1, this.top, this.w, this.h);
};

Gene.prototype.fullScreenZoom = function(x, y, w) {
  fill(0);
  rect(x-8, y-110, w+15, 350);
  fill(255);
  textAlign(CENTER);
  text(this.name, w/2 + 10, y - 70);
  textSize(12);
  if(this.mrnas.length === 1) {
    var tempName = this.mrnas[0].name;
    text(tempName, w/2 + 10, y - 35);
  } else {
    for(var m = 0; m < this.mrnas.length; m++) {
    text(this.mrnas[m].name, ((w/(this.mrnas.length + 1))*(m+1)) + 10, y - 35);
    }
  }
  
  textAlign(LEFT);
  var maxGene = (this.end - this.start);
  var interval = w/12;
  var increment = (this.end - this.start)/6;

  var tempNum;
  var num = this.start;
  textSize(16);
  for(var i = 0; i <= 12; i++) {
    stroke(255);
    if(i === 0) {
      strokeWeight(3);
      line(x-2, y - 15, x-2, y + 65);
      line(x+w+1, y-15, x+w+1, y+65);
      line(x-2, y+51, x+w, y+51);
      noStroke();
      tempNum = round(num);
      text(tempNum, x + (i*(interval)-5), y + 85);
      num += increment;
    } else if(i === 12) {
      noStroke();
      tempNum = round(num);
      textAlign(RIGHT);
      text(tempNum, x + (i*(interval) + 5), y + 85);
    } else if (i%2 === 0) {
      strokeWeight(3);
      line(x + (i*interval), y+51, x + (i*interval), y+64);
      noStroke();
      tempNum = round(num);
      text(tempNum, x + (i*(interval)-40), y + 85);
      num += increment;
    } else {
      strokeWeight(2);
      line(x + (i*interval), y+51, x + (i*interval), y+59);
    }
  }
  noStroke();

  for(var i = 0; i < this.mrnas.length; i++) {
    this.mrnas[i].setDrawParams(x, y, w, 50, this.start, maxGene);
    this.mrnas[i].drawMRNA();
  }
  for(var i = 0; i < this.exons.length; i++) {
    this.exons[i].setDrawParams(x, y, w, 50, this.start, maxGene);
    this.exons[i].drawExon();
  }
  for(var i = 0; i < this.cdss.length; i++) {
    this.cdss[i].setDrawParams(x, y, w, 50, this.start, maxGene);
    this.cdss[i].drawCDS();
  }

}

Gene.prototype.isHit = function(x,y) {
  if((x >= this.point1) && (x <= this.point1 + this.w)
    && (y >= this.top) && (y <= this.top + this.h)) {
    //console.log(this.name +" = hit");
    return true;
  } 
  return false;
};

/* toString()
 *  returns a string of the gene name
 * params: N/A
 * returns: string
*/
Gene.prototype.toString = function() {
  var toReturn = this.name + '\t' + this.start + ", " + this.end;
  return toReturn;
};


