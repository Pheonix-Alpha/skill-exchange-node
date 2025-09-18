"use client";

export default function UserCard({ user }) {
  return (
    <div className="relative bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition text-sm sm:text-base">
      <h3 className="text-lg font-bold mb-2">{user.username}</h3>

      <p className="mb-2 text-gray-600">{user.email}</p>

      {/* Offered Skills */}
      <div className="mb-3">
        <p className="font-medium text-gray-800 mb-1">🎯 They Offer:</p>
        {user.offeringSkills?.length > 0 ? (
          <ul className="space-y-1 ml-2">
            {user.offeringSkills.map((skill, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{skill}</span>
                <button
                  className="ml-2 px-3 py-1 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                  Request
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 ml-2">No skills listed</p>
        )}
      </div>

      {/* Wanted Skills */}
      <div>
        <p className="font-medium text-gray-800 mb-1">💡 They Want:</p>
        {user.wantingSkills?.length > 0 ? (
          <ul className="space-y-1 ml-2">
            {user.wantingSkills.map((skill, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{skill}</span>
                <button
                  className="ml-2 px-3 py-1 rounded-full text-sm bg-green-600 text-white hover:bg-green-700"
                >
                  Offer
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 ml-2">No skills listed</p>
        )}
      </div>
    </div>
  );
}
