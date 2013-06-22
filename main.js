              
function startup() 
{
    fitElementHeight('contentFrame', 'footerRow', 20);
    //window.onresize = fitElementHeight('contentFrame', 'footerRow', 20);
    checkSession(function(data) {
        session = data;
        if (session.logged) {
            document.getElementById('loginDiv').style.display = 'none';
            document.getElementById('sessionDiv').style.display = 'table';
            document.getElementById('loggedUser').textContent = 'Logged as ' + session.user + ' (' + session.status + ')';
        }
        document.getElementById('contentFrame').contentWindow.postMessage(session, '*');
    });
    
    var worker = new Worker('clockTask.js');
    worker.onmessage = function(event) { 
        $('#currDateDiv').html('<time datetime="' + event.data + '" pubdate>' + event.data.toLocaleString() + '</time>');
    };
    worker.postMessage('clock');
        
    $("#radioset").buttonset().change(function() {
        $("#contentFrame").attr('src', $('input[name=navRadio]:checked').val()); 
    });   
}



function validateLogin()
{
    if (!session.logged) {
        var loginUser = document.getElementById('loginUser').value;
        var loginPassword = document.getElementById('loginPassword').value;
        doLogin(loginUser, loginPassword);
    }    
    return false;
}

function doLogin(user, password) 
{
    $.ajax({
        type: "post", 
        url: SERVER_REQUESTS_PATH + "authRequests.php", 
        data: "request=login&user="+user+"&password="+hex_md5(password), 
        success: function(response) {
            var aResp = response.replace(/^\s+|\s+$/g,"").split("@");
            if (aResp[0] == 'fail') {
                alert(aResp[1]);
            } else if (aResp[0] == 'success') {
                session.logged = true;
                session.user = user;
                session.status = aResp[1];
                document.getElementById('loginDiv').style.display = 'none';
                document.getElementById('sessionDiv').style.display = 'table';
                document.getElementById('loggedUser').textContent = 'Logged as ' + session.user + ' (' + session.status + ')';
                document.getElementById('contentFrame').contentWindow.postMessage(session, '*');                                                    
            } 
        }
    });
}

function doLogout() 
{
    $.ajax({
        type: "post", 
        url: SERVER_REQUESTS_PATH + "authRequests.php", 
        data: "request=logout", 
    });
    session.logged = false;
    document.getElementById('loginDiv').style.display = 'table';
    document.getElementById('sessionDiv').style.display = 'none';
    document.getElementById('contentFrame').contentWindow.postMessage(session, '*');  
}
