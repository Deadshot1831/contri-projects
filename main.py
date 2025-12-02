import random
import time
import difflib
# To install the required libraries, run the following command in your terminal:
# pip install SpeechRecognition PyAudio
import speech_recognition as sr

def recognize_speech_from_mic(recognizer, microphone):
    """Transcribe speech from recorded from `microphone`."""
    if not isinstance(recognizer, sr.Recognizer):
        raise TypeError("`recognizer` must be `Recognizer` instance")

    if not isinstance(microphone, sr.Microphone):
        raise TypeError("`microphone` must be `Microphone` instance")

    with microphone as source:
        print("Adjusting for ambient noise...")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        print("Go!")
        audio = recognizer.listen(source)

    response = {
        "success": True,
        "error": None,
        "transcription": None
    }

    try:
        response["transcription"] = recognizer.recognize_google(audio)
    except sr.RequestError:
        response["success"] = False
        response["error"] = "API unavailable"
    except sr.UnknownValueError:
        response["error"] = "Unable to recognize speech"

    return response

def calculate_accuracy(original, transcription):
    """Calculates the accuracy of the transcription compared to the original text."""
    original = original.lower().strip()
    transcription = transcription.lower().strip()
    
    # Use difflib for a more robust comparison
    similarity = difflib.SequenceMatcher(None, original.split(), transcription.split()).ratio()
    return similarity * 100

def get_feedback(accuracy):
    """Provides simple feedback based on the accuracy score."""
    if accuracy == 100:
        return "Perfect! You nailed it!"
    elif accuracy >= 85:
        return "Almost there! Great job!"
    elif accuracy >= 60:
        return "Not bad! Try slowing down a bit."
    else:
        return "Good try! Practice makes perfect."

def main():
    """Main function to run the Tongue Twister Challenge game."""
    
    tongue_twisters = {
        "easy": [
            "She sells seashells by the seashore.",
            "A proper copper coffee pot.",
            "Red lorry, yellow lorry."
        ],
        "medium": [
            "Peter Piper picked a peck of pickled peppers.",
            "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
            "Betty Botter bought some butter but she said the butter’s bitter."
        ],
        "hard": [
            "The sixth sick sheikh's sixth sheep's sick.",
            "Pad kid poured curd pulled cod.",
            "I saw a kitten eating chicken in the kitchen."
        ],
        "insane": [
            "Rory the warrior and Roger the worrier were reared wrongly in a rural brewery.",
            "The seething sea ceaseth and thus the seething sea sufficeth us."
        ]
    }

    print("--- Welcome to the Tongue Twister Challenge! ---")

    # 1. Choose a Difficulty Level
    while True:
        difficulty = input("Choose a difficulty (easy, medium, hard, insane): ").lower()
        if difficulty in tongue_twisters:
            break
        else:
            print("Invalid difficulty. Please choose again.")

    # 2. View the Tongue Twister
    twister = random.choice(tongue_twisters[difficulty])
    print("\nGet ready! Here is your tongue twister:")
    print(f'"{twister}"')
    input("\nPress Enter when you are ready to start the timer")

    # 3. Start Speaking
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()
    
    start_time = time.time()
    recitation_result = recognize_speech_from_mic(recognizer, microphone)
    end_time = time.time()

    user_recitation = ""
    if recitation_result["transcription"]:
        user_recitation = recitation_result["transcription"]
        print(f"You said: \"{user_recitation}\"")
    
    if recitation_result["error"]:
        print(f"Error: {recitation_result['error']}")
        return # End game if there was an error

    # 4. Score & Feedback
    time_taken = end_time - start_time
    accuracy = calculate_accuracy(twister, user_recitation)

    print("\n--- Results ---")
    print(f"Time taken: {time_taken:.2f} seconds")
    print(f"Accuracy: {accuracy:.2f}%")
    print(f"Feedback: {get_feedback(accuracy)}")

if __name__ == "__main__":
    main()