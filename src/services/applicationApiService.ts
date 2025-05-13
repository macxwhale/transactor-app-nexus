
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { apiClient, createApplication, updateApplication, toggleApplicationStatus } from "@/lib/api";

export async function registerAppWithAPI(data: ApplicationFormValues): Promise<{ success: boolean; apiResponse?: any }> {
  const apiDomain = localStorage.getItem("apiDomain");
  if (!apiDomain) {
    console.log("No API domain configured");
    return { success: false };
  }

  try {
    console.log("API domain found, attempting to register with API first");
    apiClient.setBaseUrl(apiDomain);
    const apiResponse = await createApplication(data);
    console.log("API registration response:", apiResponse);
    return { success: true, apiResponse };
  } catch (error) {
    console.error("API registration failed:", error);
    return { success: false };
  }
}

export async function registerAppWithEdgeFunction(data: ApplicationFormValues): Promise<{ success: boolean; apiResponse?: any; alreadySaved?: boolean }> {
  try {
    console.log("Attempting to register with Edge Function");
    const response = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/register-app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Edge Function error:", errorData);
      return { success: false };
    }

    const apiResponse = await response.json();
    console.log("Edge Function registration response:", apiResponse);
    
    // Check if the Edge Function response indicates it already saved to Supabase
    const alreadySaved = apiResponse.saved_to_db === true;
    
    return { 
      success: true, 
      apiResponse: apiResponse.data,
      alreadySaved: alreadySaved
    };
  } catch (error) {
    console.error("Edge Function registration failed:", error);
    return { success: false };
  }
}

export async function updateAppWithAPI(id: string, data: ApplicationFormValues): Promise<{ success: boolean }> {
  const apiDomain = localStorage.getItem("apiDomain");
  if (!apiDomain) {
    return { success: false };
  }

  try {
    apiClient.setBaseUrl(apiDomain);
    await updateApplication(id, data);
    return { success: true };
  } catch (error) {
    console.warn("API update failed:", error);
    return { success: false };
  }
}

export async function updateAppWithEdgeFunction(id: string, data: ApplicationFormValues): Promise<{ success: boolean; alreadySaved?: boolean }> {
  try {
    const response = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/register-app', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data })
    });
    
    if (!response.ok) {
      return { success: false };
    }
    
    const apiResponse = await response.json();
    // Check if the Edge Function response indicates it already saved to Supabase
    const alreadySaved = apiResponse.saved_to_db === true;
    
    return { 
      success: true,
      alreadySaved: alreadySaved 
    };
  } catch (error) {
    console.warn("Edge Function update failed:", error);
    return { success: false };
  }
}

export async function toggleStatusWithAPI(id: string, isActive: boolean): Promise<{ success: boolean }> {
  const apiDomain = localStorage.getItem("apiDomain");
  if (!apiDomain) {
    return { success: false };
  }

  try {
    apiClient.setBaseUrl(apiDomain);
    await toggleApplicationStatus(id, isActive);
    return { success: true };
  } catch (error) {
    console.warn("API status update failed:", error);
    return { success: false };
  }
}

export async function toggleStatusWithEdgeFunction(id: string, isActive: boolean): Promise<{ success: boolean; alreadySaved?: boolean }> {
  try {
    const response = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/register-app', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: isActive })
    });
    
    if (!response.ok) {
      return { success: false };
    }
    
    const apiResponse = await response.json();
    // Check if the Edge Function response indicates it already saved to Supabase
    const alreadySaved = apiResponse.saved_to_db === true;
    
    return { 
      success: true,
      alreadySaved: alreadySaved 
    };
  } catch (error) {
    console.warn("Edge Function status update failed:", error);
    return { success: false };
  }
}
