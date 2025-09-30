import { ChatMessage, ParsedDataType } from "./types";

export const ExtractRequiredFieldsPrompt = (resumeText: string) => `
    Extract the following fields from the resume text:
    - name
    - email
    - phone

    Return a valid JSON object with these keys. 
    If a field is missing, set its value to null or an empty array. 
    Do not include extra commentary, only return JSON.

    Resume text:
    """
    ${resumeText}
    """
`;

export const GetChatQuestionPrompt = (
  missingFields: (keyof ParsedDataType)[],
  chatHistory: ChatMessage[],
  currUserDetails: ParsedDataType
) => {
  if (missingFields.length > 0) {
    return `
        You are an AI assistant. Ask the user for the following missing details: 
        ${missingFields.join(", ")}.

        Current user details:
        ${JSON.stringify(currUserDetails)}

        Current chat history:
        ${chatHistory.map((c) => `${c.role}: ${c.text}`).join("\n")}

        Return a JSON object with the following shape:
        {
          "currUserDetails": { /* updated user details including any new info from chat history make sure the key values start with small letters */ },
          "chat": {
            "role": "assistant",
            "text": string
          }
          "isCompleted": false /* Leave this unchanged  */
        }

        Do not include any extra commentary or explanations, only return JSON in the specified format.
    `;
  }

  return `
        You are an AI technical interviewer for a full-stack React/Node developer.
        Ask 6 questions one by one: 2 Easy → 2 Medium → 2 Hard.
        Use the chat history to not repeat questions.
    
        Current user details:
        ${JSON.stringify(currUserDetails)}
    
        Chat history:
        ${chatHistory.map((c) => `${c.role}: ${c.text}`).join("\n")}
    
        Return a JSON object with the following shape:
        {
          "currUserDetails": { /* unchanged user details */ },
          "chat": {
            "role": "assistant",
            "text": string,
            "type": "easy" | "medium" | "hard",
          }
          "isCompleted": boolean, /* updated this to true when the interview is ended and always mark this true only for Thankyou question not for final interview question */
        }
    
        Do not include any extra commentary or explanations, only return JSON in the specified format.
  `;
};


export const EvaluatePrompt = (chatHistory: ChatMessage[]) => `
You are an AI interview evaluator. Evaluate the candidate's responses from the following chat history:

${JSON.stringify(chatHistory, null, 2)}

Please provide your evaluation in the following JSON format only, without any additional text:

{
  "pros": ["List the strengths or good points from the candidate's answers"],
  "cons": ["List the weaknesses or areas of improvement"],
  "summary": "A concise summary of the candidate's performance during the interview",
  "totalPoints": number  // Assign points based on overall quality of answers (max: 10)
}

Be specific and fair. Consider clarity, relevance, completeness, and accuracy of answers. 
Assign points proportionally to the quality of responses. Only respond in the JSON format above.
`;
