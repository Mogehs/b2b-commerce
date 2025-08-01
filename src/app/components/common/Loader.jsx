const Loader = ({ fullScreen = true }) => {
    return (
        <div className={`flex items-center justify-center gap-2 md:gap-3 w-full ${fullScreen ? 'h-screen' : 'h-full'} bg-[#F1F1F1]`}>
            <div className="md:p-2.5 p-2 bg-[#C9AF2F] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="md:p-2.5 p-2 bg-[#C9AF2F] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="md:p-2.5 p-2 bg-[#C9AF2F] rounded-full animate-bounce"></div>
        </div>
    );
};

export default Loader;