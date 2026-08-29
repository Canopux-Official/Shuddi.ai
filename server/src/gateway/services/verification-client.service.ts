import axios from "axios";

const VERIFICATION_API_URL = process.env.VERIFICATION_API_URL || "http://localhost:8000";

type PythonVerificationType = "IMAGE_TEXT" | "BEFORE_AFTER" | "TEXT_ONLY";

//task creation
export const generateRubric = async (
    title: string,
    description: string,
    type: PythonVerificationType
): Promise<{ criteria: string[]; criteria_text: string }> => {
    const { data } = await axios.post(`${VERIFICATION_API_URL}/rubric/generate`, {
        title,
        description,
        type,
    });
    return data;
};

export const verifySubmission = async (payload: {
    verificationType: PythonVerificationType;
    rubric: string;
    image_path?: string;
    user_text?: string;
    image_before?: string;
    image_after?: string;
}): Promise<{ confidence_score: number }> => {
    const { data } = await axios.post(`${VERIFICATION_API_URL}/verify`, payload);
    return data;
};