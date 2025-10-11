
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a random app_id and app_secret
function generateAppId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateAppSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < 43; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const applicationData = await req.json();

    console.log("Registering new application:", applicationData.name);

    // Generate app_id and app_secret
    const app_id = generateAppId();
    const app_secret = generateAppSecret();

    // Insert the new application
    const { data, error } = await supabase
      .from("applications")
      .insert({
        name: applicationData.name,
        app_id,
        app_secret,
        passkey: applicationData.passkey,
        bearer_token: applicationData.bearer_token,
        consumer_key: applicationData.consumer_key,
        consumer_secret: applicationData.consumer_secret,
        business_short_code: applicationData.business_short_code,
        party_a: applicationData.party_a,
        party_b: applicationData.party_b,
        callback_url: applicationData.callback_url,
        originator_conversation_id: applicationData.originator_conversation_id,
        initiator_name: applicationData.initiator_name,
        initiator_password: applicationData.initiator_password,
        security_credential: applicationData.security_credential,
        command_id: applicationData.command_id,
        queue_timeout_url: applicationData.queue_timeout_url,
        result_url: applicationData.result_url,
        transaction_type: applicationData.transaction_type,
        environment: applicationData.environment || 'Production',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating application:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Application registered successfully:", data.app_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          ...data,
          app_id,
          app_secret
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
