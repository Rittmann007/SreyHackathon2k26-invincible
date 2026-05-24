let gradioClientPromise = null;

async function getGradioClient() {
  if (!process.env.FRIEND_API_URL) {
    throw new Error('FRIEND_API_URL is not set');
  }

  if (!gradioClientPromise) {
    gradioClientPromise = import('@gradio/client').then(({ client }) =>
      client(process.env.FRIEND_API_URL)
    );
  }

  return gradioClientPromise;
}

async function predictPitch(userText) {
  const hf = await getGradioClient();
  const result = await hf.predict('/generate_pitch', {
    user_text: userText,
  });

  return result?.data?.[0] ?? '';
}

module.exports = {
  getGradioClient,
  predictPitch,
};