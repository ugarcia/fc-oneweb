
function receiveMessage(evt) 
{
    session = evt.data;
    updateSessionStatus();
}
 
function updateSessionStatus() 
{
    /*
    if (!session.logged) 
        location.href = '../';
    */
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

