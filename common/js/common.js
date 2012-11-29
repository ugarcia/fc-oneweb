
const SERVER_REQUESTS_PATH = "/OneWeb/srvRequests/";

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

// 'XMLHttpRequest' object for requests to a Server PHP Script
function getAjax(requestedURL) {
    var myAjax=false;
    if (window.XMLHttpRequest) {
        myAjax = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            myAjax = newActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try {
                myAjax = newActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {}
        }
    }
    myAjax.open("POST",requestedURL,false);
    myAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
    return myAjax;
}

function checkSession(callback) 
{
    var req = getAjax(SERVER_REQUESTS_PATH + 'authRequests.php');
    req.onreadystatechange = function() {
        if (req.readyState==4 && (req.status==200||
          window.location.href.indexOf("http")==-1)) {
            var response = req.responseText.replace(/^\s+|\s+$/g,"");
            var aResp = response.split("@");
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
    }
    var cadPOST = "request=checksession";
    req.send(cadPOST); 
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
