
const SERVER_THREE_EXAMPLES_PATH = "../resources/three.js/examples";
const THREE_EXAMPLES_PATH = "../" + SERVER_THREE_EXAMPLES_PATH;

var threeExamplesNumRows = 5;

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
    
    loadThreeExamples();
}

function loadThreeExamples()
{
    $.ajax({
        type: "post", 
        url: SERVER_REQUESTS_PATH + "fileSystemRequests.php", 
        data: "request=directoryFileList&directory=" + SERVER_THREE_EXAMPLES_PATH + "&ext=html", 
        success: function(response) {
            var fileList = getListFromRawData(response);
            var cadHTML = "<td>";
            for(var i=0, j=fileList.length; i<j; i++) {
                var aux = fileList[i].split(".");
                var fileName = "";
                for (var k=0; k<aux.length-2; k++)
                    fileName += aux[k] + ".";
                fileName += aux[aux.length-2];
                cadHTML += "<a href='" + THREE_EXAMPLES_PATH + "/" + fileList[i] + "'>" + fileName + "</a><br/>";
                if (Math.floor((i+1)%(j/threeExamplesNumRows))==0) 
                    cadHTML += "</td><td>"; 
            }
            cadHTML += "</td>"; 
            $("#threeExampleFilesTr").append(cadHTML);
        }
    });
}
