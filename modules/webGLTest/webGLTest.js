var SERVER_THREE_EXAMPLES_PATH = "../resources/three.js/examples";
var THREE_EXAMPLES_PATH = "../" + SERVER_THREE_EXAMPLES_PATH;
var MIN_PIXELS_PER_EXAMPLES_COLUMN = 400;

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

    loadThreeExamples();

    $("#webglTabs").tabs();
}

function loadThreeExamples()
{
    $.ajax({
        type: "post", 
        url: SERVER_REQUESTS_PATH + "fileSystemRequests.php", 
        data: "request=directoryFileList&directory=" + SERVER_THREE_EXAMPLES_PATH + "&ext=html", 
        success: function(response) {
            var fileList = getListFromRawData(response);
            var threeExamplesNumCols =  Math.floor($(window).width() / MIN_PIXELS_PER_EXAMPLES_COLUMN);
            var cadHTML = "<td>";
            for(var i=0, j=fileList.length; i<j; i++) {
                var aux = fileList[i].split(".");
                var fileName = "";
                for (var k=0; k<aux.length-2; k++)
                    fileName += aux[k] + ".";
                fileName += aux[aux.length-2];
                cadHTML += "<a href='" + THREE_EXAMPLES_PATH + "/" + fileList[i] + "'>" + fileName + "</a><br/>";
                if (Math.floor((i+1)%(j/threeExamplesNumCols))==0) 
                    cadHTML += "</td><td>"; 
            }
            cadHTML += "</td>"; 
            $("#threeExampleFilesTr").append(cadHTML);
            var tmpHTML = $('#threeExamplesHeaderTh').html();
            $('#threeExamplesHeaderTh').replaceWith('<th colspan=' + threeExamplesNumCols + '>' + tmpHTML + '</th>');
        }
    });
}
