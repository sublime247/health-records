"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Clock, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PatientRecord {
  id: string
  patientAddress: string
  patientName: string
  fileName: string
  ipfsHash: string
  uploadDate: string
  fileSize: string
}

interface AccessRequest {
  id: string
  patientAddress: string
  patientName: string
  reason: string
  requestDate: string
  status: "pending" | "approved" | "denied"
}

export default function ProviderDashboard() {
  const { toast } = useToast()
  const [patientAddress, setPatientAddress] = useState("")
  const [accessReason, setAccessReason] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)

  // Mock data - in real app, this would come from blockchain
  const [accessibleRecords, setAccessibleRecords] = useState<PatientRecord[]>([
    {
      id: "1",
      patientAddress: "0x532925a3b8D4C0532925a3b8D4C0532925a3b8D4C0",
      patientName: "John Doe",
      fileName: "Blood_Test_Results_2024.pdf",
      ipfsHash: "QmX7Vz8K9mN2pQ4rS6tU8wV1yZ3aB5cD7eF9gH1iJ2kL3m",
      uploadDate: "2024-01-15",
      fileSize: "2.3 MB",
    },
    {
      id: "2",
      patientAddress: "0x532925a3b8D4C0532925a3b8D4C0532925a3b8D4C0",
      patientName: "John Doe",
      fileName: "X-Ray_Chest_2024.jpg",
      ipfsHash: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2",
      uploadDate: "2024-01-12",
      fileSize: "8.7 MB",
    },
  ])

  const [myRequests, setMyRequests] = useState<AccessRequest[]>([
    {
      id: "1",
      patientAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
      patientName: "Jane Smith",
      reason: "Follow-up consultation for blood test results",
      requestDate: "2024-01-16",
      status: "pending",
    },
    {
      id: "2",
      patientAddress: "0x8D4C0532925a3b8D4C0532925a3b8D4C0532925a",
      patientName: "Bob Johnson",
      reason: "Emergency medical review",
      requestDate: "2024-01-14",
      status: "approved",
    },
  ])

  const handleRequestAccess = async () => {
    if (!patientAddress || !accessReason) {
      toast({
        title: "Missing information",
        description: "Please provide both patient address and reason for access.",
        variant: "destructive",
      })
      return
    }

    setIsRequesting(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newRequest: AccessRequest = {
        id: Date.now().toString(),
        patientAddress,
        patientName: "Unknown Patient", // Would be resolved from blockchain
        reason: accessReason,
        requestDate: new Date().toISOString().split("T")[0],
        status: "pending",
      }

      setMyRequests((prev) => [newRequest, ...prev])
      setPatientAddress("")
      setAccessReason("")

      toast({
        title: "Access request sent",
        description: "Your request has been sent to the patient for approval.",
      })
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was an error sending your access request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRequesting(false)
    }
  }

  const viewRecord = (record: PatientRecord) => {
    toast({
      title: "Opening record",
      description: `Accessing ${record.fileName} from IPFS...`,
    })
    // In real app, this would decrypt and display the file from IPFS
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="request">Request Access</TabsTrigger>
          <TabsTrigger value="records">Patient Records</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Request Patient Access</span>
              </CardTitle>
              <CardDescription>Request access to a patient's health records stored on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-address">Patient Wallet Address</Label>
                <Input
                  id="patient-address"
                  placeholder="0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                />
                <p className="text-sm text-gray-500">Enter the patient's Ethereum wallet address</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Access</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a detailed reason for requesting access to this patient's records..."
                  value={accessReason}
                  onChange={(e) => setAccessReason(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleRequestAccess}
                disabled={!patientAddress || !accessReason || isRequesting}
                className="w-full"
              >
                {isRequesting ? "Sending Request..." : "Send Access Request"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Accessible Patient Records</span>
              </CardTitle>
              <CardDescription>Health records you have been granted access to view</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessibleRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{record.fileName}</p>
                        <p className="text-sm text-gray-600">Patient: {record.patientName}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded: {record.uploadDate} • Size: {record.fileSize}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {record.patientAddress.slice(0, 10)}...{record.patientAddress.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => viewRecord(record)} className="bg-green-600 hover:bg-green-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View Record
                    </Button>
                  </div>
                ))}
                {accessibleRecords.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No accessible records</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>My Access Requests</span>
              </CardTitle>
              <CardDescription>Track the status of your patient access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">Patient: {request.patientName}</h3>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "denied"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{request.reason}</p>
                        <p className="text-xs text-gray-400 font-mono">{request.patientAddress}</p>
                        <p className="text-xs text-gray-500">Requested: {request.requestDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {myRequests.length === 0 && <p className="text-center text-gray-500 py-8">No access requests sent</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
