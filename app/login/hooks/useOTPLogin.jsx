export const useOTPLogin = () => {
    const requestOTP = async (email) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/login/otp-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to send OTP. Please try again.");
        }
    };

    const verifyOTP = async (email, otp) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/login/otp-verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Invalid OTP. Please try again.");
        }
    };

    return { requestOTP, verifyOTP };
};
