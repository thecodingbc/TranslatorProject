var recognition;
var isRecording = false;
var transcript = "";

function startRecording() {
    if (!recognition) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'auto';
        // Enable multiple languages for speech recognition
        // recognition.interimResults = true;
        // recognition.continuous = true;


        recognition.onstart = function(event) {
            $("#startButton").addClass("recording");
            isRecording = true;
            transcript = ""; // Reset the transcript
            $("#speechText").text(""); // Clear the transcript box
        };

        recognition.onresult = function(event) {
            var interimTranscript = "";
            for (var i = event.resultIndex; i < event.results.length; i++) {
                var result = event.results[i];
                transcript += result[0].transcript + " ";
                if (result.isFinal) {
                    interimTranscript += result[0].transcript;
                }
            }
            $("#speechText").text(interimTranscript);
        };

        recognition.onend = function() {
            if (!isRecording) {
                return; // Skip if stop button was pressed
            }
            // Send the transcript and selected language to the server
            var selectedLanguage = $("#languageSelect").val();
            $.post("/index", { transcript: transcript, language: selectedLanguage }, function(data) {
                // Handle the translated response
                var translatedResponse = data.response;
                $("#speechTranslate").text(translatedResponse);
            });
        };
    }

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
        $("#startButton").removeClass("recording"); // Remove highlighting from the "Start Recording" button
        isRecording = false;
    }
}