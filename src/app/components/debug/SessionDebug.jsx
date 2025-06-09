"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function SessionDebug() {
  const { data: session, status } = useSession();
  const [apiSession, setApiSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessionFromAPI = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/auth/test-session");
      setApiSession(response.data.session);
    } catch (err) {
      setError(err.message || "Error fetching session data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Session Debug</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Client Session (useSession)
        </h3>
        <p>Status: {status}</p>
        {session ? (
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto">
            {JSON.stringify(
              {
                id: session.user?.id,
                name: session.user?.name,
                email: session.user?.email,
                role: session.user?.role,
                provider: session.user?.provider,
                profile: session.user?.profile,
                createdAt: session.user?.createdAt,
              },
              null,
              2
            )}
          </pre>
        ) : (
          <p>No session data available</p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Server Session (API)</h3>
        <button
          onClick={fetchSessionFromAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Server Session"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {apiSession && (
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto">
            {JSON.stringify(apiSession, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
