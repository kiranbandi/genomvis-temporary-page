/* Chromosome Class
 * Constructor Params:
 *  newIndex - int
 *  newName   - string
 *  newAltName  - string
*/
function Chromosome(newIndex, newName, newAltname) {
  this.genes = [];
  this.genesVisited = [];
  this.index = newIndex;
  this.name = newName;
  this.altName = newAltname;
  this.maxPosition;

  // zoomed in chrom 
  this.zoomedIn;        // draw params
  this.rendZoomChrom;   // rendered chrom
  this.rendZoomRW;      // rendered read wear

  // condensed chrom
  this.condensed;       // draw params
  this.rendCondChrom;   // rendered chrom
  this.rendCondRW;      // rendered read wear

  this.areaRead = [];   // array of Read Wear (Areas viewed)
  this.renderRW = false;
}

/* addGene(Gene g)
 *  -> Adds a gene to the Chromosome -> genes arraylist
 *  -> Params: g - a Gene object
 *  -> returns: nothing - void funct
*/
Chromosome.prototype.addGene = function(g) {
  this.genes.push(g);
  this.maxPosition = g.end;
};

Chromosome.prototype.setZoomDrawParams = function(left, top, w, h) {
  this.zoomedIn = new DrawParams(left, top, w, h);
};

Chromosome.prototype.setCondDrawParams = function(left, top, w, h) {
  this.condensed = new DrawParams(left, top, w, h);
};

/* drawChromosome(float left, float top, float w, float h)
 *  -> Draws the Chromosome 
 *  -> Params: left - leftmost point
 *       top  - topmost point
 *       w    - width of the chromosome
 *       h    - height of the chromosome
 *  -> returns: nothing - void funct
*/
Chromosome.prototype.drawChromosome = function() {;
  for(let i = 0; i < this.genes.length; i++) {
    this.genes[i].setDrawParams(this.left, 
                                this.top+this.h/2, 
                                this.w, this.h/2, 
                                this.maxPosition);
    this.genes[i].drawGene();
  }
  stroke(100);
  strokeWeight(1);
  noFill();
  rect(this.left, this.top, this.w, this.h);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  fill(255);
  text(this.name+"/ "+this.altName, this.left, this.top+10, this.w, this.h/2);
};

Chromosome.prototype.isHit = function(x,y) {
  if((x > this.zoomedIn.left) 
      && (x < (this.zoomedIn.left + this.zoomedIn.width))
      && (y > this.zoomedIn.top) 
      && (y < (this.zoomedIn.top + this.zoomedIn.height))) {

    return "zoomedIn";
  }
  if((x > this.condensed.left) 
      && (x < (this.condensed.left + this.condensed.width)) 
      && (y > this.condensed.top) 
      && (y < (this.condensed.top + this.condensed.height))) {

    return "condensed";
  }
};

Chromosome.prototype.drawCursor = function(offset, w, start) {
  this.areaRead.push(new Wear(255, 0, 0, 98));
  var wearNum = this.areaRead.length - 1;
  this.areaRead[wearNum].setZoomDrawParams(start, 
                                          (this.zoomedIn.top 
                                           +this.zoomedIn.height + 1), 
                                           w, 7);
  this.zoomToCondWear();
  this.areaRead[wearNum].drawWear(this.condensed.left, this.condensed.top);
  console.log("DRAWCURSOR -> areaRead: " + this.areaRead.length);

  noFill();
  stroke(255);
  strokeWeight(2);
  rect(curStart, 
      (this.zoomedIn.top + this.zoomedIn.height/2), 
       w, this.zoomedIn.height/2);
  noStroke();
};

Chromosome.prototype.renderWear = function() {
  console.log("NEWRENDERWEAR()!!!");
  var zoomRW = createGraphics(this.zoomedIn.width, 7);
  var condRW = createGraphics(this.condensed.width, 7);

  zoomRW.background(20);
  condRW.background(20);

  for(var i = 0; i < this.areaRead.length; i++) {
    zoomRW.noStroke();
    condRW.noStroke();
    zoomRW.fill(this.areaRead[i].r,
                this.areaRead[i].g, 
                this.areaRead[i].b, 
                this.areaRead[i].opacity);
    condRW.fill(this.areaRead[i].r,
                this.areaRead[i].g, 
                this.areaRead[i].b, 
                this.areaRead[i].opacity);
    if(this.areaRead.length > 0) {
      zoomRW.rect(this.areaRead[i].zoomedWear.left - 15, 0,
                  this.areaRead[i].zoomedWear.width, 
                  this.areaRead[i].zoomedWear.height);
      condRW.rect(this.areaRead[i].condensedWear.left, 0,
                  this.areaRead[i].condensedWear.width, 
                  this.areaRead[i].condensedWear.height);        
    }
  }
  this.rendZoomRW = zoomRW;
  this.rendCondRW = condRW;
  this.renderRW = false;
};


Chromosome.prototype.renderChrom = function() {
  // Condensed Version of the Chrom
  var condensedChrom = createGraphics(this.condensed.width + 2,
                                      this.condensed.height + 1);
  condensedChrom.background(0);
  condensedChrom.stroke(100);
  condensedChrom.noFill();
  condensedChrom.rect(0, 0, this.condensed.width + 1, this.condensed.height);
  for(let i = 0; i < this.genes.length; i++) {
    this.genes[i].setDrawParams(1, this.condensed.height/2, 
                                   this.condensed.width, 
                                   this.condensed.height/2, 
                                   this.maxPosition);
    condensedChrom.fill(0,255,0);
    condensedChrom.noStroke();
    condensedChrom.rect(this.genes[i].point1,
                        this.genes[i].top,
                        this.genes[i].w,
                        this.genes[i].h);
  }
  condensedChrom.fill(255);
  condensedChrom.noStroke();
  condensedChrom.textSize(18);
  condensedChrom.textAlign(CENTER, TOP);
  condensedChrom.text(this.name + "/ " + this.altName, 0 , 10, 
                      this.condensed.width, this.condensed.height/2);
  this.rendCondChrom = condensedChrom;

  // Zoomed in Version of Chrom (full screenwidth)
  var zoomedInChrom = createGraphics(this.zoomedIn.width + 1,
                                   this.zoomedIn.height + 1);
  zoomedInChrom.background(0);
  zoomedInChrom.stroke(100);
  zoomedInChrom.noFill();
  zoomedInChrom.rect(0, 0, this.zoomedIn.width, this.zoomedIn.height);
  for(let i = 0; i < this.genes.length; i++) {
    this.genes[i].setDrawParams(0, this.zoomedIn.height/2,
                                   this.zoomedIn.width,
                                   this.zoomedIn.height/2,
                                   this.maxPosition);
    zoomedInChrom.fill(0,255,0);
    zoomedInChrom.noStroke();
    zoomedInChrom.rect(this.genes[i].point1, 
                       this.genes[i].top,
                       this.genes[i].w, 
                       this.genes[i].h);
  }
  zoomedInChrom.fill(255);
  zoomedInChrom.noStroke();
  zoomedInChrom.textSize(18);
  zoomedInChrom.textAlign(CENTER, TOP);
  zoomedInChrom.text(this.name + "/ " + this.altName, 0 , 10, 
                     this.zoomedIn.width, this.zoomedIn.height/2);
  this.rendZoomChrom = zoomedInChrom;
};

/* multiGeneZoom(geneArr, x, y, w, h)
 *  -> Renders the chromosome without it having to be displayed
 *     on the canvas. Can be drawn whenever.
 *  -> Params:  - geneArr
 *              - x
 *              - y
 *              - w
 *              - h
 *  -> returns: the p5.Renderer object of the chromosome
*/
Chromosome.prototype.multiGeneZoom = function(x, y, w, h, curW, start) {
  console.log("MULTIGENEZOOM()");
  textAlign(LEFT);
  var geneArr = this.areaHit(mouseX, mouseY, 10, curW, curStart);
  var tempGenes = [];
  if(geneArr[0] !== undefined) {
    if(geneArr.length > 1) {
      //console.log("multiGeneZoom!!!!!");
      var min = geneArr[0].start;
      var max = geneArr[geneArr.length - 1].end;
      var interval = (max-min)/6;

      // Black rectangle to 'clear' the background
      fill(0);
      rect(x - 10, y + 25 , w + 10, h + 400);
      stroke(255);
      strokeWeight(3);
      line(x-2, y+172, x-2, y+85);
      line(x+w-14, y+172, x+w-14, y+85);
      line(x-2, y+h+51, x+w-15, y+h+51);
      noStroke();

      fill(255);
      text("Number of Genes in Area Selected: " + geneArr.length, x + 15, y + 60);
      textSize(16);
      if(min < 10 && min > 0) {
        text(min, x -7, y + 190);

      } else if(str(min.toExponential(2)).includes("+")){
        var sParts = split(min.toExponential(3), '+');
        text(sParts[0] + sParts[1], x - 7, y + 190);

      } else {
        text(min.toExponential(3), x - 7, y + 190);
      }

      if(max < 10 && max > 0) {
        text(max, x + w - 74, y + 190);

      } else if(str(max.toExponential(2)).includes("+")){
        var eParts = split(max.toExponential(3), '+');
        text(eParts[0] + eParts[1], x + w - 74, y + 190);
      }

      var num = min;
      var tempNum;

      for(var i = 1; i < 6; i++) {
        num += interval;
        tempNum = split(num.toExponential(3), '+');
        text(tempNum[0] + tempNum[1], x + (((w/6)-3)*i) - 30, y + 190);
      }

      var gStart;
      var gEnd;
      var gWidth;
      var gTemp;

      for(var i = 0; i < geneArr.length; i++) {
        gTemp = geneArr[i];
        gStart = map(gTemp.start, min, max, x, w);
        gEnd = map(gTemp.end, min, max, x, w);
        gWidth = gEnd - gStart;
        fill(0,255,0);
        rect(gStart, y + 100, gWidth, h/2);
        tempGenes.push(new Gene())
        for(var e = 0; e < geneArr[i].exons.length; e++) {
          geneArr[i].exons[e].zoom(y, gTemp.start, gTemp.end, gStart, gEnd);
        }
        for(var c = 0; c < geneArr[i].cdss.length; c++) {
          geneArr[i].cdss[c].zoom(y, gTemp.start, gTemp.end, gStart, gEnd);
        }
        geneArr[i].top = y + 100;
        geneArr[i].h = h/2;
        geneArr[i].point1 = gStart;
        geneArr[i].x2 = gEnd;
        geneArr[i].w = gWidth;
      }
      strokeWeight(2);
    } else {
      strokeWeight(2);
      geneArr[0].fullScreenZoom(x, y + 100, w + 15);
    }
    return geneArr;
  }
};

Chromosome.prototype.areaHit = function(x, y, areaSize, w, start) {
    var selected = [];
    var temp;

    //////////////////////////////////////////////////////////////////
    // This draws a blue line above the rectangular cursor to show
    // the area selected (FOR TESTING)
    // var testLeft;
    // var testRight;
    // if(w < 0) {
    //   testLeft = start + w;
    //   testRight = start;
    // } else {
    //   testLeft = start;
    //   testRight = start + w;
    // }

    // console.log("w: " + w);
    // console.log("start" + start);
    // console.log("testLeft: " + testLeft);
    // console.log("testRight: " + testRight);

    // stroke(0,0,255);
    // strokeWeight(1);
    // line(testLeft, this.zoomedIn.top + 46, testRight, this.zoomedIn.top + 46);
    // noStroke();
    //////////////////////////////////////////////////////////////////

    var offset = (areaSize - 1)/2;
    var leftX;
    var rightX;
    if(w < 0) {
      leftX = start + w;
      rightX = start;
    } else {
      leftX = start;
      rightX = start + w;
    }

    var areaX1 = map(leftX, this.zoomedIn.left, 
                     this.zoomedIn.left + this.zoomedIn.width, 
                     this.genes[0].start, this.maxPosition);

    var areaX2 = map(rightX, this.zoomedIn.left, 
                     this.zoomedIn.left + this.zoomedIn.width, 
                     this.genes[0].start, this.maxPosition);

    var areaWidth = areaX2 - areaX1;

    // Checks if there are genes that are partially selected
    for(var i = 0; i < this.genes.length; i++) {
      if(((this.genes[i].start >= areaX1) 
           && (this.genes[i].end > areaX1) 
           && (this.genes[i].start < areaX2)) || 
         ((this.genes[i].end <= areaX2) 
           && (this.genes[i].start < areaX2) 
           && (this.genes[i].end > areaX1))) {

        // Sorry about the gross if-statement!
        temp = Object.create(this.genes[i]);
        selected.push(temp);
      }
    }
    this.rendRW = true;
    return selected;
};

// maps the RW from the zoomed chrom to the condensed chrom
Chromosome.prototype.zoomToCondWear = function() {
  console.log("ZOOMTOCONDWEAR()");
  let wearNum = this.areaRead.length - 1;
  if(this.areaRead[wearNum] !== undefined) {
    let value = this.areaRead[wearNum].zoomedWear.left;
    let start1 = this.zoomedIn.left;
    let stop1 = this.zoomedIn.left + this.zoomedIn.width;
    let start2 = 0;
    let stop2 = this.condensed.width;
    let newX1 = map(value, start1, stop1, start2, stop2);

    value = (this.areaRead[wearNum].zoomedWear.left + 
            this.areaRead[wearNum].zoomedWear.width);

    let newX2 = map(value, start1, stop1, start2, stop2);
    let newWidth = newX2 - newX1;

    this.areaRead[wearNum].setCondDrawParams(newX1, 
                                              0, 
                                              newWidth, 7);
  }
};

// Clears RW in areaRead[], reRenders it, and then reDraws it
Chromosome.prototype.clearRW = function() {
  for(var i = this.areaRead.length; i > 0; i--) {
    this.areaRead.pop();  // clear areaRead[]
  }

  // reRender RW (will just be empty grey bar)
  this.renderWear();
  image(this.rendCondRW, this.condensed.left + 1, this.condensed.top + 43);
};

// Only displays RW from after curTimestamp 
Chromosome.prototype.restrictRW = function(curTimestamp) {
  for(var i = 0; i < this.areaRead.length; i++) {
    console.log(typeof this.areaRead[i].timestamp);
    if(moment(this.areaRead[i].timestamp).isAfter(curTimestamp)) {
      this.areaRead[i].opacity = 98;
    } else {
      this.areaRead[i].opacity = 0;
    }
  }
  this.renderWear();
  image(this.rendCondRW, 
        this.condensed.left + 1, 
        this.condensed.top + 43)
};