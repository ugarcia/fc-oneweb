<?php
	$TEMP_DIR = "../resources/tmp/";
	session_start();
	
	$success = true;
	$errString = "";
	if (isSet($_FILES['inputModel'])) {
		foreach ($_FILES['inputModel']['name'] as $key=>$fileName) {
			$fileTemp=$_FILES['inputModel']['tmp_name'][$key];
			$fileDir = $TEMP_DIR + "tmp/models/".$fileName;
			if (!move_uploaded_file($fileTemp, $fileDir)) {
				if ($success)
					$success = false;
				else
					$errString .= ", ";
				$errString .= "Could not upload model file ${fileName}";
			}
		}	
		unset($_FILES['inputModel']);	
	} else {
		$success = false;
		$errString .= "Did not find any model file";
	}

	if ($success && isSet($_FILES['inputTextures'])) {
		foreach ($_FILES['inputTextures']['name'] as $key=>$fileName) {
			$fileTemp=$_FILES['inputTextures']['tmp_name'][$key];
			$fileDir = $TEMP_DIR + "textures/".$fileName;
			if (!move_uploaded_file($fileTemp, $fileDir)) {
				if ($success)
					$success = false;
				else
					$errString .= ", ";
				$errString .= "Could not upload texture file ${fileName}";
			}
		}	
		unset($_FILES['inputTextures']);	
	}
	if ($success)
		echo "success@";
	else 
		echo "fail@${errString}";
	
?>