if ("webkitSpeechRecognition" in window) {
    // Initialize webkitSpeechRecognition
    let speechRecognition = new webkitSpeechRecognition();

    // String for the Final Transcript
    let final_transcript = "";

    // Set the properties for the Speech Recognition object
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = document.querySelector("#select_dialect").value;

    // Callback Function for the onStart Event
    speechRecognition.onstart = () => {
        // Show the Status Element
        document.querySelector("#status").style.display = "block";
    };
    speechRecognition.onerror = () => {
        // Hide the Status Element
        document.querySelector("#status").style.display = "none";
    };
    speechRecognition.onend = () => {
        // Hide the Status Element
        document.querySelector("#status").style.display = "none";
    };

    speechRecognition.onresult = (event) => {
        // Create the interim transcript string locally because we don't want it to persist like final transcript
        let interim_transcript = "";

        // Loop through the results from the speech recognition object.
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        // Set the Final transcript and Interim transcript.
        document.querySelector("#final").innerHTML = final_transcript;
        document.querySelector("#interim").innerHTML = interim_transcript;

        // Send the transcript and selected language to the server
        //var selectedLanguage = single_detection('bonjour la vie', api_key='your_api_key')
        var selectedLanguage2 = $("#select_language2").val();
        $.post("/audio", { transcript: final_transcript, language_source: selectedLanguage, language_target: selectedLanguage2}, function(data) {

            // Handle the translated response
            var translatedResponse = data.response;
            $("#speechTranslate").text(translatedResponse);
        });
    };

    // Set the onClick property of the start button
    document.querySelector("#start-recording").onclick = () => {
        // Start the Speech Recognition
        speechRecognition.start();
    };
    // Set the onClick property of the stop button
    document.querySelector("#stop-recording").onclick = () => {
        // Stop the Speech Recognition
        speechRecognition.stop();
    };
} else {
    console.log("Speech Recognition Not Available");
}