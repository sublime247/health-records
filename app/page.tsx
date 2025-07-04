"use client"

import { useState } from "react"
import { Shield, Upload, Users, FileText, Activity } from "lucide-react"
import PatientDashboard from "@/components/patient-dashboard"
import ProviderDashboard from "@/components/provider-dashboard"
import { useWallet } from "@/hooks/use-wallet"

export default function HomePage() {
  const { account, connectWallet, isConnected } = useWallet()
  const [userRole, setUserRole] = useState<"patient" | "provider">("patient")

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">HealthChain MVP</h2>
            <p className="text-gray-600 mb-8">Secure, blockchain-based healthcare data sharing</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-xl text-center border border-blue-100">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Upload Records</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center border border-green-100">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Control Access</p>
            </div>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            onClick={connectWallet}
          >
            Connect Wallet to Continue
          </button>

          <p className="text-xs text-gray-500 text-center mt-6">
            Make sure you have MetaMask installed and connected to a test network
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">HealthChain MVP</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-mono text-gray-700 border">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
              <div className="flex bg-gray-100 rounded-xl p-1 border">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${userRole === "patient"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  onClick={() => setUserRole("patient")}
                >
                  Patient
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${userRole === "provider"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  onClick={() => setUserRole("provider")}
                >
                  Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Records Stored</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Active Permissions</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Recent Activity</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {userRole === "patient" ? <PatientDashboard /> : <ProviderDashboard />}
      </main>
    </div>
  )
}
