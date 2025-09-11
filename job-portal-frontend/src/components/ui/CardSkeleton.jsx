
const CardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col animate-pulse">
        <div className="p-6 flex-grow">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div>
                    <div className="h-5 w-40 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center my-6 border-y py-4">
                <div><div className="h-4 w-20 mx-auto bg-gray-200 rounded"></div><div className="h-5 w-12 mx-auto bg-gray-200 rounded mt-2"></div></div>
                <div><div className="h-4 w-20 mx-auto bg-gray-200 rounded"></div><div className="h-5 w-12 mx-auto bg-gray-200 rounded mt-2"></div></div>
                <div><div className="h-4 w-20 mx-auto bg-gray-200 rounded"></div><div className="h-5 w-12 mx-auto bg-gray-200 rounded mt-2"></div></div>
            </div>
            <div className="space-y-3">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 p-4"><div className="h-9 w-full bg-gray-200 rounded-md"></div></div>
    </div>
);

export default CardSkeleton
