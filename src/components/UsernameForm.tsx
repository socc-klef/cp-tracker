"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { addLocalItem, getLocalItem } from "@/utils";

const platforms = ["Codeforces", "LeetCode", "CodeChef", "GitHub"];

interface UsernameFormProps {
  onUpdate: () => void;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ onUpdate }) => {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("");
  const [errors, setErrors] = useState({ username: "", platform: "" });
  const { toast } = useToast();

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = { username: "", platform: "" };

    if (!platform) {
      newErrors.platform = "Please select a platform";
      isValid = false;
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [username, platform]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const storedUsernames = JSON.parse(getLocalItem("usernames") || "{}");
      storedUsernames[platform] = username;
      addLocalItem("usernames", JSON.stringify(storedUsernames));

      toast({
        title: "Success",
        description: `Username ${username} added for ${platform}`,
      });

      setUsername("");
      setPlatform("");
      setErrors({ username: "", platform: "" });
      onUpdate();
    },
    [username, platform, validateForm, toast, onUpdate]
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-4">
        {/* Platform Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className={errors.platform ? "border-red-500" : ""}>
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
          {errors.platform && (
            <p className="text-red-500 text-sm mt-1">{errors.platform}</p>
          )}
        </motion.div>

        {/* Username Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Input
            type="text"
            placeholder={`Enter your ${platform || "username"}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "border-red-500" : ""}
            disabled={!platform}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button type="submit" className="w-full">
            Add Username
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default UsernameForm;
