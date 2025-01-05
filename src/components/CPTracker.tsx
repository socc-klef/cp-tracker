'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Problem {
  id: number
  name: string
  platform: string
  difficulty: string
}

export default function CPTracker() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [newProblem, setNewProblem] = useState({ name: '', platform: '', difficulty: '' })

  useEffect(() => {
    const storedProblems = localStorage.getItem('cpProblems')
    if (storedProblems) {
      setProblems(JSON.parse(storedProblems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cpProblems', JSON.stringify(problems))
  }, [problems])

  const addProblem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProblem.name && newProblem.platform && newProblem.difficulty) {
      setProblems([...problems, { ...newProblem, id: Date.now() }])
      setNewProblem({ name: '', platform: '', difficulty: '' })
    }
  }

  const clearAll = () => {
    setProblems([])
    localStorage.removeItem('cpProblems')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>CP Tracker</CardTitle>
        <CardDescription>Keep track of your solved competitive programming problems</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={addProblem} className="space-y-4">
          <div>
            <Label htmlFor="name">Problem Name</Label>
            <Input
              id="name"
              value={newProblem.name}
              onChange={(e) => setNewProblem({ ...newProblem, name: e.target.value })}
              placeholder="Enter problem name"
            />
          </div>
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={newProblem.platform}
              onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value })}
              placeholder="Enter platform (e.g., LeetCode, CodeForces)"
            />
          </div>
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Input
              id="difficulty"
              value={newProblem.difficulty}
              onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
              placeholder="Enter difficulty (e.g., Easy, Medium, Hard)"
            />
          </div>
          <Button type="submit">Add Problem</Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Solved Problems</h3>
          {problems.length === 0 ? (
            <p>No problems solved yet. Start adding some!</p>
          ) : (
            <ul className="space-y-2">
              {problems.map((problem) => (
                <li key={problem.id} className="bg-secondary p-3 rounded-md">
                  <strong>{problem.name}</strong> - {problem.platform} ({problem.difficulty})
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={clearAll}>Clear All Data</Button>
      </CardFooter>
    </Card>
  )
}

