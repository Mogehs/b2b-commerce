'use client';

export default function ChatBox() {
  return (
    <div className="md:min-h-screen bg-gray-100 text-gray-800 p-4">
      <div className="flex flex-col md:flex-row md:h-[90vh] overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-[25%] border border-[#ACAAAA] overflow-y-auto mr-2 space-y-2 max-md:py-2">
          {Array(7).fill(0).map((_, index) => (
            <div
              key={index}
              className="bg-white text-black border-b text-center px-4 py-4 text-sm font-medium hover:bg-gray-100 cursor-pointer"
            >
              Madina Traders
            </div>
          ))}
        </div>

        {/* Conversation Box */}
        <div className="md:w-full flex flex-col justify-between bg-white">
          <div className="flex flex-col h-[60vh] md:h-full">
            <div className="flex-1 flex items-center justify-center text-sm text-center p-4 border border-[#ACAAAA]">
              <p className="font-semibold text-black">
                Conversation Box with date time stamp
              </p>
            </div>

            {/* Message Input */}
            <div className="flex border border-[#ACAAAA] w-full mt-3">
              <button className="bg-[#C9AF2F] hover:bg-yellow-700 px-8 py-2 text-sm font-semibold cursor-pointer text-black">
                Send
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border-l border-gray-300 bg-white text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
