import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def transcribe_audio(file_path):
    # Ensure raw audio can be fed to Whisper
    # For now assuming compatible format (mp3, wav, m4a, etc.)
    audio_file = open(file_path, "rb")
    translation = client.audio.transcriptions.create(
        model="whisper-1", 
        file=audio_file,
        response_format="text"
    )
    return translation
