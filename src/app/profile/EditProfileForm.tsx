"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { RefreshCw, ArrowLeft, Check, X } from "lucide-react"
import { LocationPicker } from "@/components/ui/location-picker"
import { useUserProfile } from "@/hooks/use-user-profile"
import { toast } from "sonner"

interface EditProfileFormProps {
    apiKey: string;
}

export default function EditProfileForm({ apiKey }: EditProfileFormProps) {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile()
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState({
    swapRequests: true,
    redemptions: true,
    newsletters: false,
  })
  const [location, setLocation] = useState<google.maps.LatLngLiteral | undefined>()
  const [avatarKey, setAvatarKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with user data
  useEffect(() => {
    if (userProfile && !isProfileLoading) {
      setFullName(userProfile.full_name || "")
      setUsername(userProfile.username || "")
      setBio(userProfile.bio || "")
      
      // Set location if available
      if (userProfile.location && typeof userProfile.location === 'object') {
        const loc = userProfile.location as { lat: number; lng: number }
        setLocation({ lat: loc.lat, lng: loc.lng })
      }
    }
  }, [userProfile, isProfileLoading])

  const colors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-green-400 to-emerald-400',
    'from-orange-400 to-red-400',
    'from-indigo-400 to-purple-400',
    'from-teal-400 to-blue-400',
    'from-rose-400 to-pink-400',
    'from-yellow-400 to-orange-400',
  ]

  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const shuffleAvatar = () => {
    setAvatarKey(prev => prev + 1)
  }

  const getCurrentInitials = () => {
    if (userProfile?.full_name) {
      return generateInitials(userProfile.full_name)
    }
    if (userProfile?.username) {
      return generateInitials(userProfile.username)
    }
    return 'U'
  }

  const getCurrentColor = () => {
    return colors[avatarKey % colors.length]
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    if (value === userProfile?.username) {
      setUsernameAvailable(true)
      return
    }
    
    setIsCheckingUsername(true)
    // Simulate API call - you should replace this with actual API call
    setTimeout(() => {
      setUsernameAvailable(value.length > 0 && !['admin', 'test', 'user'].includes(value.toLowerCase()))
      setIsCheckingUsername(false)
    }, 500)
  }

  const toggleNotification = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just show a success message
      
      // Example API call structure:
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     full_name: fullName,
      //     username: username,
      //     bio: bio,
      //     location: location,
      //     email_notifications: emailNotifications
      //   })
      // })
      
      // if (!response.ok) throw new Error('Failed to update profile')
      
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
      console.error('Error updating profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">Unable to load user profile. Please try again.</p>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your profile information and preferences</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Avatar Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        {userProfile.avatar_url ? (
                          <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name || userProfile.username || 'User'} />
                        ) : null}
                        <AvatarFallback className={`bg-gradient-to-br ${getCurrentColor()} text-white font-semibold text-lg`}>
                          {getCurrentInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <button 
                        type="button"
                        onClick={shuffleAvatar}
                        className="absolute bottom-0 right-0 bg-white border-2 border-gray-300 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <Button type="button" variant="outline" size="sm" onClick={shuffleAvatar}>
                        Shuffle Avatar Colors
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        Click to change avatar background color
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <div className="relative mt-1">
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => handleUsernameChange(e.target.value)}
                          className="pr-10"
                          placeholder="Enter your username"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isCheckingUsername ? (
                            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                          ) : usernameAvailable ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {usernameAvailable ? 'Username is available' : 'Username is taken'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email || ''}
                      className="mt-1 bg-gray-50"
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Email cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <LocationPicker 
                      apiKey={apiKey} 
                      onValueChange={setLocation} 
                      value={location}
                      className="aspect-video"
                      defaultCenter={location || { lat: 40.7128, lng: -74.0060 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Security & Preferences */}
            <div className="space-y-6">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Swap Requests</Label>
                      <p className="text-sm text-gray-500">Get notified when someone wants to swap with you</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification('swapRequests')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        emailNotifications.swapRequests ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                          emailNotifications.swapRequests ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Redemptions</Label>
                      <p className="text-sm text-gray-500">Get notified about point redemptions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification('redemptions')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        emailNotifications.redemptions ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                          emailNotifications.redemptions ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Newsletters</Label>
                      <p className="text-sm text-gray-500">Receive our weekly newsletter</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification('newsletters')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        emailNotifications.newsletters ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                          emailNotifications.newsletters ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Points Balance</span>
                    <span className="font-semibold">{userProfile.points_balance || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Items Listed</span>
                    <span className="font-semibold">{userProfile.total_items_listed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Swaps Completed</span>
                    <span className="font-semibold">{userProfile.total_swaps_completed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="font-semibold">
                      {new Date(userProfile.member_since || userProfile.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Link href="/dashboard">
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || !usernameAvailable}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 