
var SERVER_REQUESTS_PATH = "/OneWeb/srvRequests/";

var session = { logged: false, 
                user: '', 
                status: '' };
                                
function setFrameContent(frame, content)
{
    document.getElementById(frame).src = content;
}

function getYCoord(elem) {
    return elem.offsetParent ? (elem.offsetTop + getYCoord(elem.offsetParent)) : elem.offsetTop;
}

function fitElementHeight(elem, next, buffer)
{
    var elm = document.getElementById(elem);
    if(elm==null || elm==undefined)
        return;
    var height = window.innerHeight || document.body.offsetHeight || document.documentElement.clientHeight;
    //alert($(window).height() + "," + height);
    var next = document.getElementById(next);
    if(next!=null && next!=undefined)
        height -= next.offsetHeight;
    height -= getYCoord(elm) + buffer;
    height = (height < 0) ? 0 : height;
    elm.style.height = height + 'px';
}

function setOpacity(elm, value) 
{
    document.getElementById(elm).style.opacity = value;
}

function getMousePos(elm, evt) 
{
    var rect = elm.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left; 
    var mouseY = evt.clientY - rect.top;
    return {
      x: Math.round(mouseX),
      y: Math.round(mouseY)
    };
}

function elementSupportsAttribute(element, attribute) {
    var test = document.createElement(element);
    if (attribute in test) {
        return true;
    } else {
        return false;
    }
}

function checkSession(callback) 
{
    $.ajax({
        type: "post", 
        url: SERVER_REQUESTS_PATH + "authRequests.php", 
        data: "request=checksession", 
        success: function(response) {
            var aResp = response.replace(/^\s+|\s+$/g,"").split("@");
            var session = { logged: false, 
                            user: '', 
                            status: '' };
            if (aResp[0] == 'success') {
                var aParam = aResp[1].split("#");
                session.logged = true;
                session.user = aParam[0];
                session.status = aParam[1];
            }
            callback(session);
        }
    }); 
}

function checkAccess() 
{
    if (location == parent.location)
        location.href = '/OneWeb'; 
}

function getListFromRawData(rawData)
{
    var list = null;
    var data = rawData.replace(/^\s+|\s+$/g,"").split("@");
    if (data[0]=='fail')
        alert(data[1]);
    else
        list = data[1].split("#");    
    return list;
}

function adjustAngle(ang)
{
    if (ang > Math.PI*2) {
        ang -= Math.PI*2;
    } else if (ang < -Math.PI*2) {
        ang += Math.PI*2;
    }
    return ang;
}
