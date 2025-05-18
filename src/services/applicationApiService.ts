
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { apiClient, createApplication, updateApplication } from "@/lib/api";

// Update return types to be consistent across all functions
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

export async function registerAppWithEdgeFunction(data: ApplicationFormValues): Promise<{ success: boolean; apiResponse?: any }> {
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
    
    return { 
      success: true, 
      apiResponse: apiResponse.data || apiResponse
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

export async function updateAppWithEdgeFunction(id: string, data: ApplicationFormValues): Promise<{ success: boolean }> {
  try {
    console.log("Attempting to update with Edge Function", { id, ...data });
    const response = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/update-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge Function update error:", errorText);
      return { success: false };
    }
    
    const result = await response.json();
    console.log("Edge Function update response:", result);
    
    return { success: true };
  } catch (error) {
    console.warn("Edge Function update failed:", error);
    return { success: false };
  }
}

export async function toggleStatusWithEdgeFunction(id: string, isActive: boolean): Promise<{ success: boolean }> {
  try {
    const response = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/toggle-app-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: isActive })
    });
    
    if (!response.ok) {
      console.error("Edge Function status update failed:", response.status, response.statusText);
      return { success: false };
    }
    
    await response.json();
    
    return { success: true };
  } catch (error) {
    console.warn("Edge Function status update failed:", error);
    return { success: false };
  }
}
