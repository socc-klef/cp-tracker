"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLocalItem } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StoredUsernames = () => {
  const [usernames, setUsernames] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedUsernames = JSON.parse(getLocalItem("usernames") || "{}");
    setUsernames(storedUsernames);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>Stored Usernames</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(usernames).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(usernames).map(([platform, username]) => (
                <motion.li
                  key={platform}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium">{platform}:</span>
                  <span>{username}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No usernames stored yet.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StoredUsernames;
