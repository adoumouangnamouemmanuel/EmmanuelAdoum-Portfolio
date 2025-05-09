"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Github, Linkedin, Save, Twitter, User } from 'lucide-react'
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserData {
  name: string
  email: string
  image: string | null
  bio: string
  github: string
  twitter: string
  linkedin: string
  emailNotifications: boolean
  commentNotifications: boolean
}

function SettingsForm({ user }: { user: any }) {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || null,
    bio: user?.bio || "",
    github: user?.github || "",
    twitter: user?.twitter || "",
    linkedin: user?.linkedin || "",
    emailNotifications: user?.emailNotifications ?? true,
    commentNotifications: user?.commentNotifications ?? true,
  })
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [imageHover, setImageHover] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/users/${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          setUserData({
            name: data.name || "",
            email: data.email || "",
            image: data.image || null,
            bio: data.bio || "",
            github: data.github || "",
            twitter: data.twitter || "",
            linkedin: data.linkedin || "",
            emailNotifications: data.emailNotifications ?? true,
            commentNotifications: data.commentNotifications ?? true,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        })
      }
    }

    fetchUserData()
  }, [session?.user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        // Update session with new data
        await update({
          ...session,
          user: {
            ...session.user,
            name: userData.name,
            image: userData.image,
          },
        })
        // Redirect to profile page
        router.push("/profile")
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/users/${session?.user?.id}/avatar`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to upload image")
      }

      const data = await response.json()
      setUserData((prev) => ({ ...prev, image: data.imageUrl }))
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            className="group flex items-center text-muted-foreground hover:text-foreground transition-all"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Card className="border-none shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
            
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-6">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Settings
                </CardTitle>
              </motion.div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Tabs 
                defaultValue="profile" 
                className="space-y-6"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md transition-all"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.5a6.002 6.002 0 00-4 5.659v3.159a2.032 2.032 0 01-.595 1.436L6 17H1m5-11v1a1 1 0 001 1h3.5a1 1 0 001-1v-1a1 1 0 00-1-1H7a1 1 0 00-1 1z" />
                    </svg>
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={activeTab === "profile" ? "visible" : "hidden"}
                  >
                    <motion.div 
                      className="flex flex-col items-center justify-center mb-6"
                      variants={itemVariants}
                    >
                      <div 
                        className="relative group"
                        onMouseEnter={() => setImageHover(true)}
                        onMouseLeave={() => setImageHover(false)}
                      >
                        <Avatar className="h-32 w-32 ring-4 ring-purple-100 dark:ring-purple-900 shadow-lg">
                          <AvatarImage
                            src={userData.image || session?.user?.image || ""}
                            alt={userData.name || session?.user?.name || "User"}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-2xl">
                            {(userData.name || session?.user?.name || "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <motion.div 
                          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: imageHover ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Camera className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        <input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                          className="hidden" 
                          disabled
                        />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-2">
                        Click on the image to upload a new profile picture
                      </p>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                        className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userData.email} 
                        disabled 
                        className="bg-gray-50 dark:bg-gray-800/50"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <Textarea
                        id="bio"
                        value={userData.bio}
                        onChange={(e) => setUserData((prev) => ({ ...prev, bio: e.target.value }))}
                        className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                    </motion.div>

                    <motion.div 
                      className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl"
                      variants={itemVariants}
                    >
                      <h3 className="font-medium text-sm">Social Profiles</h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Github className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Label htmlFor="github" className="text-sm font-medium sr-only">GitHub Profile</Label>
                        </div>
                        <Input
                          id="github"
                          value={userData.github}
                          onChange={(e) => setUserData((prev) => ({ ...prev, github: e.target.value }))}
                          placeholder="https://github.com/username"
                          className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Twitter className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Label htmlFor="twitter" className="text-sm font-medium sr-only">Twitter Profile</Label>
                        </div>
                        <Input
                          id="twitter"
                          value={userData.twitter}
                          onChange={(e) => setUserData((prev) => ({ ...prev, twitter: e.target.value }))}
                          placeholder="https://twitter.com/username"
                          className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Label htmlFor="linkedin" className="text-sm font-medium sr-only">LinkedIn Profile</Label>
                        </div>
                        <Input
                          id="linkedin"
                          value={userData.linkedin}
                          onChange={(e) => setUserData((prev) => ({ ...prev, linkedin: e.target.value }))}
                          placeholder="https://linkedin.com/in/username"
                          className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </TabsContent>

                <TabsContent value="notifications">
                  <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={activeTab === "notifications" ? "visible" : "hidden"}
                  >
                    <motion.div 
                      className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
                      variants={itemVariants}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for comments and replies
                          </p>
                        </div>
                        <Switch
                          checked={userData.emailNotifications}
                          onCheckedChange={(checked) =>
                            setUserData((prev) => ({
                              ...prev,
                              emailNotifications: checked,
                            }))
                          }
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
                      variants={itemVariants}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Comment Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications for new comments on your posts
                          </p>
                        </div>
                        <Switch
                          checked={userData.commentNotifications}
                          onCheckedChange={(checked) =>
                            setUserData((prev) => ({
                              ...prev,
                              commentNotifications: checked,
                            }))
                          }
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Save Preferences
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function SettingsClient({ user }: { user: any }) {
  return (
    <SessionProvider>
      <SettingsForm user={user} />
    </SessionProvider>
  )
}
