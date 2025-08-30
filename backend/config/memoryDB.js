// Simple in-memory database for fallback
class MemoryDB {
  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.sessions = new Map();
  }

  // User operations
  createUser(userData) {
    const id = Date.now().toString();
    const user = { id, ...userData, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  findUserById(id) {
    return this.users.get(id) || null;
  }

  // Document operations
  createDocument(docData) {
    const id = Date.now().toString();
    const document = { id, ...docData, createdAt: new Date() };
    this.documents.set(id, document);
    return document;
  }

  getDocuments(userId) {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  deleteDocument(id) {
    return this.documents.delete(id);
  }
}

// Global instance
const memoryDB = new MemoryDB();

export default memoryDB;
