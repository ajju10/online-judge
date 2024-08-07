export const pollTaskStatus = async (taskId: string): Promise<any> => {
  const url = Bun.env.CODE_ENGINE_SERVER! + `/task/${taskId}`;
  const pollInterval = 1000; // Poll every second
  const maxAttempts = 10;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(url);
        const resBody = await response.json();
        const taskStatus = resBody.result.status;
        if (taskStatus === 2) {
          clearInterval(interval);
          resolve(resBody.result);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error("Max polling attempts reached"));
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, pollInterval);
  });
};
