"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Layout from "@/components/Layout";

export default function InboxPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) return;

        const currentUser = JSON.parse(storedUser);
        const currentUserId = currentUser.id || currentUser._id;

        const res = await axios.get("/exchange/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pendingRequests = res.data.filter(
          r => r.recipient?._id?.toString() === currentUserId.toString()
        );

        setRequests(pendingRequests);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");

      await axios.put(`/exchange/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the request's status locally
      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Failed to update request:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Inbox</h1>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No requests.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map(req => (
              <li
                key={req._id}
                className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{req.requester.name}</p>
                  <p className="text-sm text-gray-500">
                    Wants: {req.skillWanted} | Offered: {req.skillOffered}
                  </p>
                </div>
                <div className="flex gap-2">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(req._id, "accepted")}
                        disabled={updatingId === req._id}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req._id, "rejected")}
                        disabled={updatingId === req._id}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded font-semibold ${
                        req.status === "accepted"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
