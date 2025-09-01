// In-memory database for demo/testing purposes
class MemoryDB {
  constructor() {
    this.documents = [];
    this.users = [
      {
        _id: 'demo-user-1',
        email: 'bastin123@gmail.com',
        password: 'test123', // In real app, this would be hashed
        name: 'Demo User'
      }
    ];
    this.nextId = 1;
  }

  // Document operations
  async createDocument(docData) {
    const document = {
      _id: `doc-${this.nextId++}`,
      ...docData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.push(document);
    return document;
  }

  async findDocumentsByUser(userId) {
    return this.documents.filter(doc => doc.uploadedBy === userId);
  }

  async findDocumentById(id) {
    return this.documents.find(doc => doc._id === id);
  }

  async updateDocument(id, updates) {
    const index = this.documents.findIndex(doc => doc._id === id);
    if (index !== -1) {
      this.documents[index] = { ...this.documents[index], ...updates, updatedAt: new Date() };
      return this.documents[index];
    }
    return null;
  }

  async deleteDocument(id) {
    const index = this.documents.findIndex(doc => doc._id === id);
    if (index !== -1) {
      const deleted = this.documents.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }

  // User operations
  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findUserById(id) {
    return this.users.find(user => user._id === id);
  }

  // Health check
  async healthCheck() {
    return {
      status: 'healthy',
      database: 'memory',
      documentsCount: this.documents.length,
      usersCount: this.users.length
    };
  }
}

// Create singleton instance
const memoryDB = new MemoryDB();

export default memoryDB;
