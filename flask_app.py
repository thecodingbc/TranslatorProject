from flask import Flask, request, render_template, redirect, jsonify
from pathlib import Path

import speech_recognition as sr
import deep_translator as dt
import detectlanguage

detectlanguage.configuration.api_key = "8e9094fb7c31dd79f3f3feae335dded9"
CWD = Path(__file__).parent.resolve()

languages = ['afrikaans', 'albanian', 'amharic', 'arabic', 'armenian', 'assamese', 'aymara', 'azerbaijani', 'bambara', 'basque', 'belarusian', 'bengali', 'bhojpuri', 'bosnian', 'bulgarian', 'catalan', 'cebuano', 'chichewa', 'chinese (simplified)', 'chinese (traditional)', 'corsican', 'croatian', 'czech', 'danish', 'dhivehi', 'dogri', 'dutch', 'english', 'esperanto', 'estonian', 'ewe', 'filipino', 'finnish', 'french', 'frisian', 'galician', 'georgian', 'german', 'greek', 'guarani', 'gujarati', 'haitian creole', 'hausa', 'hawaiian', 'hebrew', 'hindi', 'hmong', 'hungarian', 'icelandic', 'igbo', 'ilocano', 'indonesian', 'irish', 'italian', 'japanese', 'javanese', 'kannada', 'kazakh', 'khmer', 'kinyarwanda', 'konkani', 'korean', 'krio', 'kurdish (kurmanji)', 'kurdish (sorani)', 'kyrgyz', 'lao', 'latin', 'latvian', 'lingala', 'lithuanian', 'luganda', 'luxembourgish', 'macedonian', 'maithili', 'malagasy', 'malay', 'malayalam', 'maltese', 'maori', 'marathi', 'meiteilon (manipuri)', 'mizo', 'mongolian', 'myanmar', 'nepali', 'norwegian', 'odia (oriya)', 'oromo', 'pashto', 'persian', 'polish', 'portuguese', 'punjabi', 'quechua', 'romanian', 'russian', 'samoan', 'sanskrit', 'scots gaelic', 'sepedi', 'serbian', 'sesotho', 'shona', 'sindhi', 'sinhala', 'slovak', 'slovenian', 'somali', 'spanish', 'sundanese', 'swahili', 'swedish', 'tajik', 'tamil', 'tatar', 'telugu', 'thai', 'tigrinya', 'tsonga', 'turkish', 'turkmen', 'twi', 'ukrainian', 'urdu', 'uyghur', 'uzbek', 'vietnamese', 'welsh', 'xhosa', 'yiddish', 'yoruba', 'zulu']


app = Flask(__name__)


@app.route('/', methods=['GET'])
def main():
    return render_template('./homepage.html')

@app.route('/audio', methods=['GET', 'POST'])
def audio():
    transcript = request.form.get('transcript')
    #language_source = request.form.get('language_source')
    language_target = request.form.get('language_target')
    language_source = detectlanguage.detect(transcript)
    if transcript:
        print(transcript)
        # lang = dt.single_detection(transcript, api_key="8e9094fb7c31dd79f3f3feae335dded9")
        translated = dt.GoogleTranslator(source=language_source, target=language_target).translate(transcript)
        return jsonify({'response': translated})
    return render_template('audiotranslation.html')



@app.route('/visual', methods=['GET', 'POST'])
def visual():
    transcript = request.form.get('transcript')
    language_source = request.form.get('language_source')
    language_target = request.form.get('language_target')
    if transcript:
        print(transcript)
        #lang = dt.single_detection(transcript, api_key="8e9094fb7c31dd79f3f3feae335dded9")
        translated = dt.MyMemoryTranslator(source=language_source, target=language_target).translate(transcript)
        return jsonify({'response': translated})


    return render_template('visualtranslation.html', languages=languages)

@app.route('/text', methods=['GET', 'POST'])
def text():
    return render_template('texttranslation.html')


app.run(debug=True)