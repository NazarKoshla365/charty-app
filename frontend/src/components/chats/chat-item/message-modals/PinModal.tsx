'use client'



interface PinModalProps {
    chatId: string;
    selectedPinTime: string;
    setSelectedPinTime: React.Dispatch<React.SetStateAction<string>>;
    isShowPinModalAction: boolean;
    setIsShowPinModalAction: (isShow: boolean) => void;
    pinsState: Record<string, { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>;
    setPinsState: React.Dispatch<React.SetStateAction<Record<string, { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>>>

}
export function PinModal({ chatId, selectedPinTime, setSelectedPinTime, isShowPinModalAction, setIsShowPinModalAction,
    pinsState, setPinsState
}: PinModalProps) {


    const savePinnedMessage = async (updatedPins: Record<string, { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>) => {
        try {
            const res = await fetch('http://localhost:4000/chat/save/pinned-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pins: updatedPins
                })
            })
            const data = await res.json()
            console.log('Pinned message saved successfully:', data);
        }
        catch (err) {
            console.error("Error saving pinned messages:", err)
        }
    }
    const handlePinTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPinTime(e.target.value)
    }
    return (
        <>
            {isShowPinModalAction && (
                <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-xl p-6 w-96 border border-gray-200 animate-fade-in">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Specify how long to display a pinned message</h4>
                    <p className="text-sm text-gray-500 mb-4">You can unpin it at any time</p>
                    <div className="flex flex-col gap-y-3">
                        {[
                            { id: "1-hour", label: "1 hour" },
                            { id: "1-day", label: "1 day" },
                            { id: "1-week", label: "1 week" },
                        ].map((item) => (
                            <label key={item.id} htmlFor={item.id} className="flex items-center gap-3 cursor-pointer">
                                <span className="w-5 h-5 flex justify-center items-center border-2 border-gray-400 rounded-full transition-all duration-200">
                                    <input
                                        type="radio"
                                        name="pin-time"
                                        id={item.id}
                                        value={item.id}
                                        checked={selectedPinTime === item.id}
                                        className="hidden peer"
                                        onChange={handlePinTimeChange}
                                    />
                                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></span>
                                </span>
                                <span className="text-gray-700">{item.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex items-center gap-x-4 mt-6 justify-center">
                        <button onClick={() => {

                            setPinsState(prev => {
                                const updated = {
                                    ...prev,
                                    [chatId]: {
                                        confirmed: true,
                                        msgId: prev[chatId]?.msgId || '',
                                        pinMessage: prev[chatId]?.pinMessage || '',
                                        from: prev[chatId]?.from || '',
                                        pinTime: selectedPinTime
                                    }
                                };

                                savePinnedMessage(updated);
                                return updated;
                            });
                            setIsShowPinModalAction(false);
                        }} className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                            Pin
                        </button>
                        <button onClick={() => setIsShowPinModalAction(false)} className="flex-1 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200">
                            Cancel
                        </button>
                    </div>

                </div >
            )
            }

        </>
    )
}