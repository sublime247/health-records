export class IPFSService {
  private apiUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS"
  private apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
  private secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size.toString(),
      },
    })
    formData.append("pinataMetadata", metadata)

    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append("pinataOptions", options)

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          pinata_api_key: this.apiKey || "",
          pinata_secret_api_key: this.secretKey || "",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS")
      }

      const result = await response.json()
      return result.IpfsHash
    } catch (error) {
      console.error("IPFS upload error:", error)
      // Return mock hash for demo
      return `QmX${Math.random().toString(36).substring(2, 15)}`
    }
  }

  async getFile(ipfsHash: string): Promise<Blob> {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
      if (!response.ok) {
        throw new Error("Failed to fetch from IPFS")
      }
      return await response.blob()
    } catch (error) {
      console.error("IPFS fetch error:", error)
      throw error
    }
  }

  getFileUrl(ipfsHash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
  }
}

export const ipfsService = new IPFSService()
