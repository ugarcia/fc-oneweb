var canvas1;
var cv1ctx;
var mousePos;
var mouseDownHandler,
    mouseUpHandler,
    mmouseMoveHandler;

function receiveMessage(evt) 
{
    session = evt.data;
    updateSessionStatus();
}
 
function updateSessionStatus() 
{
    if (session.logged) {
        // TODO
    } else {
        // TODO
    }
} 
                                
function startup()
{
    checkAccess();
    checkSession(function(data) {
       session = data;
       updateSessionStatus();
    });
    window.addEventListener("message", receiveMessage, false);
    InitCanvas();
}

function InitCanvas() 
{
    canvas1 = document.getElementById("canvas1");
    cv1ctx = canvas1.getContext("2d");
    
    canvas1.addEventListener('mousedown', mouseDownHandler = function(evt) { mMouseDown(canvas1, evt); }, false);
    
    var w = canvas1.clientWidth;
    var h = canvas1.clientHeight;
    var grd=cv1ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/2);
    grd.addColorStop(0,"red");
    grd.addColorStop(0.5,"green");
    grd.addColorStop(1,"blue");

    cv1ctx.fillStyle=grd;
    cv1ctx.fillRect(0,0,w,h);

}

function mMouseDown(elm, evt) 
{
    
    elm.removeEventListener("mousedown", mouseDownHandler, false);
    elm.addEventListener("mouseup", mouseUpHandler = function(evt) { mMouseUp(elm, evt); }, false);
    elm.addEventListener("mousemove", mouseMoveHandler = function(evt) { mMouseMove(elm, evt); }, false);
    mousePos = getMousePos(elm, evt);
    cv1ctx.moveTo(mousePos.x, mousePos.y);
}


function mMouseUp(elm, evt) 
{
    elm.removeEventListener("mouseup", mouseUpHandler, false);
    elm.removeEventListener("mousemove", mouseMoveHandler, false);
    elm.addEventListener('mousedown', mouseDownHandler = function(evt) { mMouseDown(elm, evt); }, false);
}

function mMouseMove(elm, evt) 
{
    mousePos = getMousePos(elm, evt);
    
    var cadHTML = '('+mousePos.x+','+mousePos.y+')';
    document.getElementById('mousePosP').innerHTML = cadHTML;
    
    cv1ctx.lineTo(mousePos.x, mousePos.y);
    cv1ctx.strokeStyle="white";
    cv1ctx.lineWidth=5;
    cv1ctx.stroke();
    
    cv1ctx.moveTo(mousePos.x, mousePos.y);
}
