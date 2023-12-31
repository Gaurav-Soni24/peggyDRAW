const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorsBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

//global variable with defalut value
let prevMouseX,prevMouseY,snapshot,
isDrawing = false,
selectedTool = "brush",
selectedColor = "#000",
brushWidth = 5;

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle= selectedColor;
}

window.addEventListener("load", () => {
    //setting canvas width/height... offsetwidth/height return viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
})

const drawRect = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX,prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX,prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath();//creating new path to draw circle
    //getting radius for circle according to mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX),2) + Math.pow((prevMouseY - e.offsetY),2))
    ctx.arc(prevMouseX,prevMouseY,radius,0,2 *Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX,e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDrawing = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;//passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY;//passing current mouseY position as prevMouseY value
    ctx.beginPath();//Create new path to draw
    ctx.lineWidth = brushWidth;//passing brushSize as line width
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    //copying canvas data and passing a snapshot value...this avoids dragging the image
    snapshot = ctx.getImageData(0,0,canvas.width,canvas.height)
}

const drawing = (e) => {
    if (!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot,0,0);//adding copied canvas data on this canvas

    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
        ctx.lineTo(e.offsetX, e.offsetY);//creating line according to the mouse pointer
        ctx.stroke();//drawing/filing line with color
    }else if (selectedTool === "rectangle"){
        drawRect(e);
    }else if (selectedTool === "circle"){
        drawCircle(e);
    }else if (selectedTool === "triangle"){
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click" , () => {//adding click event to all toll option
        //removing active class from the previous option and adding on current clicker option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        // console.log(selectedTool);
    })
})

sizeSlider.addEventListener("change", () =>{
    brushWidth = sizeSlider.value
});

colorsBtns.forEach(btn => {
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = (window.getComputedStyle(btn).getPropertyValue("background-color"));
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
})

saveImg.addEventListener("click",()=>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});
canvas.addEventListener("mousemove", drawing);