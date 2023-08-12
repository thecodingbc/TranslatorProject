import pandas as pd
import speech_recognition as sr
import nltk
from nltk.corpus import wordnet
import string
from gensim.parsing.preprocessing import remove_stopwords, STOPWORDS

nltk.download('wordnet')
nltk.download('omw-1.4')


all_stopwords_gensim = STOPWORDS
sw_list = {""} # list of stopwords to exclude
all_stopwords_gensim = STOPWORDS.difference(sw_list)


r = sr.Recognizer()
m = sr.Microphone(device_index=2)

def recognize_speech_from_mic(recognizer, microphone):
    """Transcribe speech from recorded from `microphone`.

    Returns a dictionary with three keys:
    "success": a boolean indicating whether or not the API request was
               successful
    "error":   `None` if no error occured, otherwise a string containing
               an error message if the API could not be reached or
               speech was unrecognizable
    "transcription": `None` if speech could not be transcribed,
               otherwise a string containing the transcribed text
    """
    # check that recognizer and microphone arguments are appropriate type
    if not isinstance(recognizer, sr.Recognizer):
        raise TypeError("`recognizer` must be `Recognizer` instance")

    if not isinstance(microphone, sr.Microphone):
        raise TypeError("`microphone` must be `Microphone` instance")

    # adjust the recognizer sensitivity to ambient noise and record audio
    # from the microphone
    with microphone as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    # set up the response object
    response = {
        "success": True,
        "error": None,
        "transcription": None
    }

    # try recognizing the speech in the recording
    # if a RequestError or UnknownValueError exception is caught,
    #     update the response object accordingly
    try:
        response["transcription"] = recognizer.recognize_google(audio)
    except sr.RequestError:
        # API was unreachable or unresponsive
        response["success"] = False
        response["error"] = "API unavailable"
    except sr.UnknownValueError:
        # speech was unintelligible
        response["error"] = "Unable to recognize speech"

    return response

while True:
    confirm = input("Do you want to record audio? (Y/N) ")
    if confirm == "n" or confirm == "N":
        break
    else:
        guess = recognize_speech_from_mic(r, m)
        print("You said: {}".format(guess["transcription"]))

        # # initialise temporary variables
        # word_list = []
        # converted_word_list = []
        # list_of_levels = []
        # synonyms = []

        # sentence = text.lower() # removes punctuation and converts sentence to lowercase

        # word_list = sentence.split(" ")
        
        # word_list = [word for word in word_list if not word in all_stopwords_gensim] # excludes stopwords from new word list
        # print(word_list)