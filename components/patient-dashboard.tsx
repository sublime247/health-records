"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Users, Check, X, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HealthRecord {
  id: string
  fileName: string
  ipfsHash: string
  uploadDate: string
  fileSize: string
}

interface AccessRequest {
  id: string
  providerName: string
  providerAddress: string
  reason: string
  requestDate: string
  status: "pending" | "approved" | "denied"
}

interface ActivePermission {
  id: string
  providerName: string
  providerAddress: string
  grantedDate: string
  lastAccessed: string
}

export default function PatientDashboard() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Mock data - in real app, this would come from blockchain/IPFS
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      fileName: "Blood_Test_Results_2024.pdf",
      ipfsHash: "QmX7Vz8K9mN2pQ4rS6tU8wV1yZ3aB5cD7eF9gH1iJ2kL3m",
      uploadDate: "2024-01-15",
      fileSize: "2.3 MB",
    },
    {
      id: "2",
      fileName: "MRI_Scan_Brain_2024.dcm",
      ipfsHash: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2",
      uploadDate: "2024-01-10",
      fileSize: "45.7 MB",
    },
  ])

  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([
    {
      id: "1",
      providerName: "Dr. Sarah Johnson",
      providerAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
      reason: "Follow-up consultation for blood test results",
      requestDate: "2024-01-16",
      status: "pending",
    },
    {
      id: "2",
      providerName: "City General Hospital",
      providerAddress: "0x8D4C0532925a3b8D4C0532925a3b8D4C0532925a",
      reason: "Emergency medical review",
      requestDate: "2024-01-14",
      status: "pending",
    },
  ])

  const [activePermissions, setActivePermissions] = useState<ActivePermission[]>([
    {
      id: "1",
      providerName: "Dr. Michael Chen",
      providerAddress: "0x532925a3b8D4C0532925a3b8D4C0532925a3b8D4C0",
      grantedDate: "2024-01-12",
      lastAccessed: "2024-01-15",
    },
  ])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      // Simulate IPFS upload and blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newRecord: HealthRecord = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        ipfsHash: `QmX${Math.random().toString(36).substring(2, 15)}`,
        uploadDate: new Date().toISOString().split("T")[0],
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      }

      setRecords((prev) => [newRecord, ...prev])
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast({
        title: "Record uploaded successfully",
        description: "Your health record has been securely stored on IPFS and registered on the blockchain.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleAccessRequest = (requestId: string, approve: boolean) => {
    setAccessRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: approve ? "approved" : "denied" } : req)),
    )

    if (approve) {
      const request = accessRequests.find((req) => req.id === requestId)
      if (request) {
        const newPermission: ActivePermission = {
          id: Date.now().toString(),
          providerName: request.providerName,
          providerAddress: request.providerAddress,
          grantedDate: new Date().toISOString().split("T")[0],
          lastAccessed: "Never",
        }
        setActivePermissions((prev) => [newPermission, ...prev])
      }
    }

    toast({
      title: approve ? "Access granted" : "Access denied",
      description: `You have ${approve ? "granted" : "denied"} access to your health records.`,
    })
  }

  const revokeAccess = (permissionId: string) => {
    setActivePermissions((prev) => prev.filter((perm) => perm.id !== permissionId))
    toast({
      title: "Access revoked",
      description: "Provider access has been successfully revoked.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload Records</TabsTrigger>
          <TabsTrigger value="records">My Records</TabsTrigger>
          <TabsTrigger value="requests">Access Requests</TabsTrigger>
          <TabsTrigger value="permissions">Active Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Health Record</span>
              </CardTitle>
              <CardDescription>
                Securely upload your health records to IPFS with blockchain verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.dcm,.txt"
                />
                <p className="text-sm text-gray-500">Supported formats: PDF, Images, DICOM, Text files</p>
              </div>

              {selectedFile && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Ready to upload: <strong>{selectedFile.name}</strong> (
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
                {isUploading ? "Uploading..." : "Upload to Blockchain"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>My Health Records</span>
              </CardTitle>
              <CardDescription>All your health records stored securely on IPFS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{record.fileName}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded: {record.uploadDate} • Size: {record.fileSize}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">IPFS: {record.ipfsHash.slice(0, 20)}...</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Access Requests</span>
              </CardTitle>
              <CardDescription>Healthcare providers requesting access to your records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessRequests
                  .filter((req) => req.status === "pending")
                  .map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{request.providerName}</h3>
                            <Badge variant="outline">Pending</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{request.reason}</p>
                          <p className="text-xs text-gray-400 font-mono">{request.providerAddress}</p>
                          <p className="text-xs text-gray-500">Requested: {request.requestDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleAccessRequest(request.id, true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAccessRequest(request.id, false)}>
                            <X className="w-4 h-4 mr-1" />
                            Deny
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {accessRequests.filter((req) => req.status === "pending").length === 0 && (
                  <p className="text-center text-gray-500 py-8">No pending access requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Active Permissions</span>
              </CardTitle>
              <CardDescription>Healthcare providers with access to your records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{permission.providerName}</h3>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">{permission.providerAddress}</p>
                      <p className="text-sm text-gray-500">
                        Granted: {permission.grantedDate} • Last accessed: {permission.lastAccessed}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeAccess(permission.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Revoke Access
                    </Button>
                  </div>
                ))}
                {activePermissions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No active permissions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
