'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from "@/hooks/use-toast"
import { motion } from 'framer-motion'

const platforms = ['Codeforces', 'LeetCode', 'CodeChef', 'GitHub']

const UsernameForm = () => {
  const [username, setUsername] = useState('')
  const [platform, setPlatform] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !platform) {
      toast({
        title: "Error",
        description: "Please enter a username and select a platform",
        variant: "destructive",
      })
      return
    }
    // TODO: Implement API call to add username
    console.log(`Adding username ${username} for platform ${platform}`)
    toast({
      title: "Success",
      description: `Username ${username} added for ${platform}`,
    })
    setUsername('')
    setPlatform('')
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button type="submit" className="w-full">Add Username</Button>
        </motion.div>
      </div>
    </motion.form>
  )
}

export default UsernameForm

