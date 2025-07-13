import { create } from 'ipfs-http-client';

// Configure IPFS client - you can use a local node or a service like Infura
const IPFS_CONFIG = {
  // For local IPFS node
  host: 'localhost',
  port: 5001,
  protocol: 'http',
  
  // For Infura (uncomment and add your credentials)
  // host: 'ipfs.infura.io',
  // port: 5001,
  // protocol: 'https',
  // headers: {
  //   authorization: 'Basic ' + Buffer.from('PROJECT_ID:PROJECT_SECRET').toString('base64')
  // }
  
  // For Web3.Storage (alternative implementation)
  // You'll need to implement Web3Storage client separately
};

let ipfsClient = null;

// Initialize IPFS client
const initializeIPFS = () => {
  try {
    if (!ipfsClient) {
      ipfsClient = create(IPFS_CONFIG);
    }
    return ipfsClient;
  } catch (error) {
    console.log('IPFS initialization error:', error);
    return null;
  }
};

const ipfsService = {
  // Upload encrypted file to IPFS
  async uploadFile(encryptedData, fileName) {
    try {
      const client = initializeIPFS();
      if (!client) {
        return { 
          success: false, 
          error: 'IPFS client not available. Please ensure IPFS node is running or configure a remote service.' 
        };
      }

      // Convert encrypted string to buffer
      const buffer = Buffer.from(encryptedData, 'utf8');
      
      // Upload to IPFS
      const result = await client.add({
        path: fileName,
        content: buffer
      });

      return { 
        success: true, 
        data: {
          hash: result.cid.toString(),
          size: result.size,
          path: result.path
        }
      };
    } catch (error) {
      if (error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to IPFS. Please ensure your IPFS node is running or check your IPFS service configuration.' 
        };
      }
      return { success: false, error: `IPFS upload failed: ${error.message}` };
    }
  },

  // Download file from IPFS
  async downloadFile(ipfsHash) {
    try {
      const client = initializeIPFS();
      if (!client) {
        return { 
          success: false, 
          error: 'IPFS client not available. Please ensure IPFS node is running or configure a remote service.' 
        };
      }

      // Get file from IPFS
      const chunks = [];
      for await (const chunk of client.cat(ipfsHash)) {
        chunks.push(chunk);
      }

      // Combine chunks into single buffer
      const buffer = Buffer.concat(chunks);
      const encryptedData = buffer.toString('utf8');

      return { success: true, data: encryptedData };
    } catch (error) {
      if (error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to IPFS. Please ensure your IPFS node is running or check your IPFS service configuration.' 
        };
      }
      return { success: false, error: `IPFS download failed: ${error.message}` };
    }
  },

  // Pin file to ensure it stays available
  async pinFile(ipfsHash) {
    try {
      const client = initializeIPFS();
      if (!client) {
        return { 
          success: false, 
          error: 'IPFS client not available.' 
        };
      }

      await client.pin.add(ipfsHash);
      return { success: true };
    } catch (error) {
      return { success: false, error: `IPFS pin failed: ${error.message}` };
    }
  },

  // Unpin file to save space
  async unpinFile(ipfsHash) {
    try {
      const client = initializeIPFS();
      if (!client) {
        return { 
          success: false, 
          error: 'IPFS client not available.' 
        };
      }

      await client.pin.rm(ipfsHash);
      return { success: true };
    } catch (error) {
      return { success: false, error: `IPFS unpin failed: ${error.message}` };
    }
  },

  // Get IPFS node info
  async getNodeInfo() {
    try {
      const client = initializeIPFS();
      if (!client) {
        return { 
          success: false, 
          error: 'IPFS client not available.' 
        };
      }

      const info = await client.id();
      return { 
        success: true, 
        data: {
          id: info.id,
          addresses: info.addresses,
          version: info.agentVersion
        }
      };
    } catch (error) {
      return { success: false, error: `Failed to get IPFS info: ${error.message}` };
    }
  },

  // Check if IPFS is available
  async isAvailable() {
    try {
      const result = await this.getNodeInfo();
      return result.success;
    } catch (error) {
      return false;
    }
  }
};

export default ipfsService;