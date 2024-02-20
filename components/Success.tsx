import React from 'react'

function Success({ onClose, onAction }: { onClose: Function, onAction: Function }) {
    return (
        <section className='fixed inset-0 w-full h-screen z-50 grid place-items-center'>
            <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md' onClick={() => onClose()}></div>
            <div className='bg-white rounded-xl p-10 flex flex-col gap-2 items-center justify-center relative opacTranslate'>
                <h1 className='text-3xl font-medium'>Data Validated Successfully</h1>
                <p>You can now submit submit the form </p>
                <div className='grid grid-cols-2 gap-6 w-full mt-6'>
                    <button type="button" onClick={() => onClose()} className="bg-rose-500 text-white py-2 text-lg rounded-lg">Cancel</button>
                    <button type="button" onClick={() => onAction()} className="bg-black text-white py-2 text-lg rounded-lg">Submit</button>
                </div>
            </div>
        </section>
    )
}

export default Success