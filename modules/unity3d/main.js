function receiveMessage(evt)
{
    session = evt.data;
    updateSessionStatus();
    fitElementHeight("glContainer", 'footerRow', 30);
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

    $("#unity3dTabs").tabs();
}

