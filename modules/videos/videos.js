var videoListTitles = ['Rock', 'Metal', 'Disco', 'Top/New'];
var videoListSearchs = [['Muse', 'Kaiser Chiefs', 'Franz Ferdinand', 'New Politics'], 
                        ['Trivium', 'Arch Enemy', 'Korn', 'Machine Head'], 
                        ['Sneaky Sound System', 'M.I.A', 'The Faint', 'The Prodigy'], 
                        ['ytfeed:most_viewed.today', 'ytfeed:most_viewed.this_week', 
                         'ytfeed:top_rated', 'ytfeed:recently_featured']];


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
    
    LoadVideoBars();
}

function LoadVideoBars() {
    var mvb = null;
    for (var i=0; i<videoListSearchs.length; i++) {
        var htmlString = "<tr><th>"+videoListTitles[i]+"</th>"+
                         "<td><div id='videoBar"+i+"'></div></td></tr>";
        $('table#videosTable').append(htmlString);
        var barContainer = document.getElementById("videoBar"+i);
        var options = {
            largeResultSet : true,
            horizontal: true,
            thumbnailSize : GSvideoBar.THUMBNAILS_LARGE,
            autoExecuteList : {
                cycleTime : GSvideoBar.CYCLE_TIME_LONG,
                cycleMode : GSvideoBar.CYCLE_MODE_LINEAR,
                executeList : videoListSearchs[i]
            }
        }
        if (i!=0)
            options.master = mvb;
        var ytp = (i==0) ?  document.getElementById('ytplayer') : null;
        var videoBar = new GSvideoBar(barContainer, ytp, options);
        if (i==0)
            mvb = videoBar;
    }
    document.getElementById('.idle_gsvb').style.display = 'block';
}