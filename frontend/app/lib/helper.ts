import { supabase } from "./supabase";

export  const fetcher = async <T>(
    url:string,
    options?: RequestInit
): Promise<T> => {
    if (!navigator.onLine) {
		throw new Error('No internet connection. Please check your network.');
	}

    const {data} = await supabase.auth.getSession();
    const access_token = data.session?.access_token

    if(!access_token) throw new Error("No session found.")
    
    const isFormData = options?.body instanceof FormData;
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...(isFormData ? {} : {"Content-Type": "application/json"}),
                Authorization: `Bearer ${access_token}`,
                ...(options?.headers || {}),
            }
        })
    
        if(!res.ok) {
            let errorMessage = `Error: ${res.status}`;
            try {
                const errorData = await res.json();
                if (errorData.error) errorMessage = errorData.error;
            } catch {}
            throw new Error(errorMessage)
        }
        return res.json();

    } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch!") {
            throw new Error("Network error: Please check your internet connections.");
        }
        throw error;
    }
    

}