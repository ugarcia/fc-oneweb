var videoBaseRef = '/OneWeb/resources/videos/';
var videos = ['NaughtyBots_net_sample', 
              'NaughtyBots_2player_sample'];
var imageBaseRef = '/OneWeb/resources/images/';           
var posters = ['sample_network_shoot.png', 
               'sample_2player_shoot.png'];

function receiveMessage(evt) 
{
    session = evt.data;
    updateSessionStatus();
}

function updateSessionStatus() 
{
    if (true/*session.logged*/) {
        document.getElementById('playNaughtyBots').style.display='inline';
        document.getElementById('playNaughtyBotsUnreg').style.display='none';
    } else {
        document.getElementById('playNaughtyBots').style.display='none';
        document.getElementById('playNaughtyBotsUnreg').style.display='inline';
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
    setVideo('video1', 0);    
}

function setVideo(elem, n)
{
    document.getElementById(elem+"mp4").src = videoBaseRef + videos[n] + ".mp4";
    document.getElementById(elem+"webm").src = videoBaseRef + videos[n] + ".webm";
    document.getElementById(elem+"ogv").src = videoBaseRef + videos[n] + ".ogv";
    document.getElementById(elem).poster = imageBaseRef + posters[n];
    document.getElementById(elem).load();
}

function getCurrVideo(elem)
{
    var elm = document.getElementById(elem);
    var fullPath =  elm.currentSrc.split("/");
    var aux =  fullPath[fullPath.length-1].split(".");
    var currVideo = "";
    for (var i=0; i<aux.length-1; i++) {
        currVideo += aux[i];
        if (i<aux.length-2)
            currVideo += ".";
    }
    for (var i=0; i<videos.length; i++)
        if (videos[i] == currVideo)
            return i;
    return -1;
}

function nextVideo(elem) 
{
    var currVideo = getCurrVideo(elem);
    if (currVideo == -1)
        return;
    nextV = (currVideo + 1) % videos.length;    
    setVideo(elem, nextV);    
}

function prevVideo(elem) 
{
    var currVideo = getCurrVideo(elem);
    if (currVideo == -1)
        return;
    prevV = (currVideo - 1 + videos.length) % videos.length;    
    setVideo(elem, prevV);    
}

function naughtyBotsPlay()
{
    location.href = 'naughtyBots/';
}
