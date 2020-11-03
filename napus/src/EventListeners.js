var dateNum;

function keyTyped() {
  //keepReading = !keepReading;
  if(key === "c") {
    for(var b = 0; b < cList.length; b++) {
      cList[b].clearRW();
      if (curChromNum === b) {
        image(cList[b].rendZoomRW, 
              cList[b].zoomedIn.left, 
              cList[b].zoomedIn.top + 101);
      }
    }  
    window.localStorage.clear();
  }
}

function mouseClicked() {  
  for(var i = 0; i < cList.length; i++) { 
    // Checks to see if mouse clicked on condensed chromosome
    if(cList[i].isHit(mouseX, mouseY) === "condensed") {
      console.log("Chrom["+i+"] = pressed");
      
      if(i !== curChromNum) {
        fill(0);
        rect(7, 420, screenWidth-15, 750);

        if(cList[curChromNum] !== undefined) {
          // Checks to see if any new read wear was added
          // If true, then render new read wear
          if(cList[curChromNum].rendRW === true) {
            cList[curChromNum].renderWear();
          }
        }
        
        curChromNum = i;
        currentChrom = cList[i];
        
        // displays zoomed in chromosome with read wear
        image(currentChrom.rendZoomRW, 
              currentChrom.zoomedIn.left, 
              currentChrom.zoomedIn.top + currentChrom.zoomedIn.height + 1);
        image(currentChrom.rendZoomChrom, 15, 335);
        
        fill(255);
        noStroke();
        textSize(18);
        if(message2 === false) {
          text("Select section of chromosome to view more closely: ",30, 310);
          message2 = true;
        }
      } 
      return true;
    }

    // if the zoomed in chrom is clicked on
    if(currentChrom !== undefined && currentChrom.isHit(initialX, initialY) === "zoomedIn") { 
      regionGenes = currentChrom.multiGeneZoom(15, 450, screenWidth-15, 100, curWidth, curStart);

      // ruler marks
      var incr = currentChrom.zoomedIn.width/12;
      for(var lPos = 1; lPos <= 11; lPos++) {
        stroke(255);
        if(lPos%2 === 0) {
          strokeWeight(3);
          line(currentChrom.zoomedIn.left + (incr*lPos), 602,
               currentChrom.zoomedIn.left + (incr*lPos), 615);
        } else {  
          strokeWeight(2);
          line(currentChrom.zoomedIn.left + (incr*lPos), 602,
               currentChrom.zoomedIn.left + (incr*lPos), 610);
        }
        strokeWeight(1);
        noStroke();
      } 
      return true;
    }
    if (regionGenes !== undefined) {
      for (var z = 0; z < regionGenes.length; z++) {
        if(regionGenes[z].isHit(mouseX, mouseY)) {
          regionGenes[z].fullScreenZoom(15, 825, screenWidth-30);
        }
      }
    }
  }
  return false;
}

function mouseReleased() {
  if(currentChrom !== undefined && zoomPressed === true) {
    
    currentChrom.drawCursor(4.5, curWidth, curStart);

    if(bSupportsLocal) {
      key = "chrom" + curChromNum;
      value = JSON.stringify(cList[curChromNum].areaRead);
      window.localStorage.setItem(key, value);
    }
  }
  tempX = undefined;
  zoomPressed = false;
}

function mousePressed() {
  initialX = mouseX;
  initialY = mouseY;
  if(cList[curChromNum] !== undefined) {
    if(currentChrom.isHit(initialX, initialY) === "zoomedIn" && initialY >= (currentChrom.zoomedIn.top + 50)) {
      zoomPressed = true;
    }
  }
}

function rwSelectEvent() {
  var item = rwSelect.value();
  var now = moment();
  var curTimestamp;

  if(item === 'All') {
    console.log('Date & Time: ' + curTimestamp);
    dateNum = 0;
  } else {
    if(item === 'Month (31/30/28 Days)') {
      curTimestamp = now.subtract(1, 'months');
      console.log(curTimestamp);
  
    } else if(item === 'Week (7 Days)') {
      curTimestamp = now.subtract(7, 'days').format();
      console.log('Week: ' + now.calendar());
  
    } else if(item === 'Day (24 Hours)') {
      curTimestamp = now.subtract(1, 'days').format();
      console.log('Day: ' + now.format('DD'));
  
    } else if(item === 'Hour (60 Minutes)') {
      curTimestamp = now.subtract(1, 'hours').format();
      console.log('Hour: ' + now.format('hh'));

    } else if(item === 'Minute (60 Seconds)') {
      curTimestamp = now.subtract(1, 'minutes').format();
      console.log('Minute: ' + now.format('mm'));
    } 
    dateNum = curTimestamp;
  }
  //console.log('DateNum:' + dateNum);
  //console.log(cList[15].areaRead[0].timestamp < dateNum);
  for(var i = 0; i < cList.length; i++) {
    if(cList[i].areaRead.length > 0) {
      cList[i].restrictRW(dateNum);
      if(curChromNum === i) {
        image(cList[i].rendZoomRW, 
              cList[i].zoomedIn.left, 
              cList[i].zoomedIn.top + 101);
      }
    }
  }
}
