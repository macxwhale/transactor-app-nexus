
// Follow Deno's ES modules approach
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.9'
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Serve HTTP requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    // Extract the request data
    const data = await req.json()
    const { 
      id,
      name,
      callback_url,
      consumer_key,
      consumer_secret,
      business_short_code,
      passkey,
      bearer_token,
      party_a,
      party_b 
    } = data

    // Required validation
    if (!id) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required field: id',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the app exists
    const { data: existingApp, error: fetchError } = await supabase
      .from('applications')
      .select('name')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Error checking application: ${fetchError.message}`)
    }

    if (!existingApp) {
      return new Response(
        JSON.stringify({ 
          error: 'Application not found',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Check if another app with the same name exists (excluding this one)
    const { data: duplicateApp, error: duplicateError } = await supabase
      .from('applications')
      .select('id')
      .eq('name', name)
      .neq('id', id)
      .maybeSingle()

    if (duplicateError) {
      throw new Error(`Error checking for duplicate: ${duplicateError.message}`)
    }

    if (duplicateApp) {
      return new Response(
        JSON.stringify({ 
          error: `Another application with name "${name}" already exists`,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Update the application
    const { data: updatedApp, error: updateError } = await supabase
      .from('applications')
      .update({
        name,
        callback_url,
        consumer_key,
        consumer_secret,
        business_short_code,
        passkey,
        bearer_token,
        party_a,
        party_b,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Error updating application: ${updateError.message}`)
    }

    // Return success response
    return new Response(
      JSON.stringify({
        message: 'Application updated successfully',
        data: updatedApp
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Server error:', error.message)
    
    // Return error response
    return new Response(
      JSON.stringify({
        error: 'Failed to update application',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
