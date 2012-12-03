
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
    $.ajax({
        type: "post", 
        url: SERVER_REQUESTS_PATH + "authRequests.php", 
        data: "request=register&user="+registerUser+"&password="+hex_md5(registerPassword)+"&email="+registerEmail, 
        success: function(response) {
            // TODO server response handler
            alert(response.replace(/^\s+|\s+$/g,""));
        }
    });
    return false;
}
