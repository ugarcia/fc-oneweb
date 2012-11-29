              
function startup() 
{
    fitElementHeight('contentFrame', 'footerRow', 20);
    //window.onresize = fitElementHeight('contentFrame', 'footerRow', 20);
    checkSession(function(data) {
        session = data;
        if (session.logged) {
            document.getElementById('loginDiv').style.display = 'none';
            document.getElementById('sessionDiv').style.display = 'table';
            document.getElementById('loggedUser').textContent = 'Logged as ' + session.user + 
                                                                ' (' + session.status + ')';
        }
        document.getElementById('contentFrame').contentWindow.postMessage(session, '*');
    });
}

function validateLogin()
{
    if (!session.logged) {
        var loginUser = document.getElementById('loginUser').value;
        var loginPassword = document.getElementById('loginPassword').value;
        doLogin(loginUser, loginPassword);
    } else {
        doLogout();
    }    
    return false;
}

function doLogin(user, password) 
{
   var req = getAjax(SERVER_REQUESTS_PATH + 'authRequests.php');
    req.onreadystatechange = function() {
        if (req.readyState==4 && (req.status==200||
          window.location.href.indexOf("http")==-1)) {
            var response = req.responseText.replace(/^\s+|\s+$/g,"");
            var aResp = response.split("@");
            if (aResp[0] == 'fail') {
                alert(aResp[1]);
            } else if (aResp[0] == 'success') {
                session.logged = true;
                session.user = user;
                session.status = aResp[1];
                document.getElementById('loginDiv').style.display = 'none';
                document.getElementById('sessionDiv').style.display = 'table';
                document.getElementById('loggedUser').textContent = 'Logged as ' + session.user + 
                                                                    ' (' + session.status + ')';
                
                document.getElementById('contentFrame').contentWindow.postMessage(session, '*');                                                    
            }  
        }   
    }
    var cadPOST = "request=login";
    cadPOST += "&user="+user;
    cadPOST += "&password="+hex_md5(password);
    req.send(cadPOST); 
}

function doLogout() 
{
    var req = getAjax(SERVER_REQUESTS_PATH + 'authRequests.php');
    var cadPOST = "request=logout";
    req.send(cadPOST);
    session.logged = false;
    document.getElementById('loginDiv').style.display = 'table';
    document.getElementById('sessionDiv').style.display = 'none';
    document.getElementById('contentFrame').contentWindow.postMessage(session, '*');  
}
