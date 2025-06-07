const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_KEY, SUPABASE_BUCKET_NAME } = process.env;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadToSupabase(buffer, mimetype, originalname) {
  const fileExt = originalname.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error } = await supabase
    .storage
    .from(SUPABASE_BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: mimetype,
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from(SUPABASE_BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrl;
}

module.exports = uploadToSupabase;

