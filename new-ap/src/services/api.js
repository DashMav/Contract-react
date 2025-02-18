export const api = {
  getSources: async () => {
    // Example implementation
    return [];
  },
  uploadSource: async (file) => {
    // Example implementation
    return { id: 1, filename: file.name };
  },
  sendMessage: async (message, sources) => {
    // Example implementation
    console.log("Message sent:", message);
    console.log("Sources used:", sources);
    return { response: `Response to: ${message}` };
  },
  createNote: async (note) => {
    // Example implementation
    return { id: 1, content: note };
  }
};
