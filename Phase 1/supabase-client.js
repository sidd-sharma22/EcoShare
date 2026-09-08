// ==========================================
// EcoShare - Supabase Browser Client
// ==========================================

(() => {
  "use strict";

  if (!window.supabase) {
    throw new Error("Supabase JS was not loaded before supabase-client.js.");
  }

  const config = window.ECOSHARE_CONFIG;

  if (!config?.SUPABASE_URL || !config?.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("EcoShare Supabase configuration is missing.");
  }

  const client = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  async function getSession() {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function getUser() {
    const { data, error } = await client.auth.getUser();
    if (error) return null;
    return data.user;
  }

  async function signIn(email, password) {
    return client.auth.signInWithPassword({ email, password });
  }

  async function signUp(email, password, fullName) {
    return client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
  }

  async function signOut() {
    return client.auth.signOut();
  }

  async function resetPassword(email) {
    return client.auth.resetPasswordForEmail(email);
  }

  async function getResources() {
    const { data, error } = await client
      .from("resources")
      .select(`
        id,
        owner_id,
        owner_name,
        title,
        description,
        category,
        location,
        available,
        image_url,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(normalizeResource);
  }

  async function getResourceById(resourceId) {
    const { data, error } = await client
      .from("resources")
      .select(`
        id,
        owner_id,
        owner_name,
        title,
        description,
        category,
        location,
        available,
        image_url,
        created_at
      `)
      .eq("id", resourceId)
      .maybeSingle();

    if (error) throw error;
    return data ? normalizeResource(data) : null;
  }

  function normalizeResource(resource) {
    return {
      id: Number(resource.id),
      ownerId: resource.owner_id,
      owner: resource.owner_name || "EcoShare User",
      title: resource.title,
      description: resource.description,
      category: resource.category,
      location: resource.location,
      available: Boolean(resource.available),
      image: resource.image_url || "",
      createdAt: resource.created_at
    };
  }

  async function createBorrowRequest(resourceId, message) {
    const user = await getUser();

    if (!user) {
      const error = new Error("AUTH_REQUIRED");
      error.code = "AUTH_REQUIRED";
      throw error;
    }

    const { data, error } = await client
      .from("borrow_requests")
      .insert({
        resource_id: resourceId,
        requester_id: user.id,
        message: message.trim(),
        status: "pending"
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  window.EcoShareSupabase = Object.freeze({
    client,
    getSession,
    getUser,
    signIn,
    signUp,
    signOut,
    resetPassword,
    getResources,
    getResourceById,
    createBorrowRequest
  });
})();
