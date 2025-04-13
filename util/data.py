from pydantic import BaseModel, Field
from typing import List

# Represents a single stuttered word detected in the transcription.
class StutterWord(BaseModel):
    word: str = Field(
        description="The word that was stuttered. A stutter typically appears as a repeated syllable or letter (e.g., 't-t-today', 'I-I-I')."
    )
    num_stutter: int = Field(
        description="The number of times this word was stuttered in the transcription. Count repeated syllabic starts or repeated full words as individual stutter events."
    )

# Represents a single actionable or affirmational suggestion based on the audio transcription.
class Suggestions(BaseModel):
    suggestion: str = Field(
        description="A one-sentence piece of feedback about the user's speech delivery. This should be either a suggestion for improvement or a positive affirmation of something they did well. Keep it short and direct."
    )
    suggestion_type: bool = Field(
        description="Boolean flag: true if the suggestion is for improvement, false if it's an affirmation of something the user did well."
    )

# Main output schema for the NLP analysis of a user's transcription.
class NLPAnalysis(BaseModel):
    stuttered_words: List[StutterWord] = Field(
        description="A list of unique stuttered words from the transcription. Stutters should be detected when a word or its starting syllable is repeated multiple times (e.g., 'I-I-I', 'th-th-the')."
    )
    actionable_comments: List[Suggestions] = Field(
        description="A list of feedback messages. Each message should either highlight an area for improvement or positively reinforce something the user did well during their speech."
    )
