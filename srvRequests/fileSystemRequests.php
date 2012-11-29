<?php

	$reqKeys = array('directoryFileList' => 0);
	session_start();

	
	if (isSet($_POST['request'])) {
		switch ($reqKeys[$_POST['request']]) {
			
			// GET URL FILE LIST
			case 0: {
				if (!isSet($_POST['directory'])) {
					echo "fail@directory format error";
				} else {
					$dir  = opendir($_POST['directory']);
					$response = '';
					while (false !== ($fileName = readdir($dir)))
						if (!isSet($_POST['ext']) || end(explode(".", $fileName)) == $_POST['ext'])
					    	$response .= "${fileName}#";
					echo "success@".rtrim($response,"#");					
				}
				break;
			}
			
		}

	} else {
		echo 'fail@error in request code';	
	}
	
?>