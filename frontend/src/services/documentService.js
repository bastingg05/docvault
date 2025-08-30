import API from "../api";

// Get all documents for the logged-in user
export const getDocuments = async () => {
  const { data } = await API.get("/documents");
  // Mock API returns { documents: [...] }, so we need to extract the documents array
  return data.documents || data;
};

// Create a new document
export const createDocument = async (documentData) => {
  const { data } = await API.post("/documents", documentData);
  return data;
};

// Delete a document
export const deleteDocument = async (documentId) => {
  const { data } = await API.delete(`/documents/${documentId}`);
  return data;
}; 