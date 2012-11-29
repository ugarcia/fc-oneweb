
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
}

function validateRegister()
{
    var registerUser = document.getElementById('registerUser').value;
    var registerPassword = document.getElementById('registerPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var registerEmail = document.getElementById('registerEmail').value;
    // TODO validate email
    if (registerPassword != confirmPassword) {
        alert("Password and confirmation don't match");
        return false;
    }
    var req = getAjax(SERVER_REQUESTS_PATH + 'authRequests.php');
    req.onreadystatechange = function() {
        if (req.readyState==4 && (req.status==200||
          window.location.href.indexOf("http")==-1)) {
            var response = req.responseText.replace(/^\s+|\s+$/g,"");
            // TODO server response handler
            alert(response);       
        }   
    }
    var cadPOST = "request=register";
    cadPOST += "&user="+registerUser;
    cadPOST += "&password="+hex_md5(registerPassword);
    cadPOST += "&email="+registerEmail;
    req.send(cadPOST);
    return false;
}
