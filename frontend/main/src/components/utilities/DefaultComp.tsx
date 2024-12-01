
import sample from "../../assets/Logo BK.jpg"

const DefaultComp = () => {
    return (
        <div className='hidden md:flex gap-y-8 flex-col h-full m-auto items-center justify-center bg-nav-bg'>
            <div>
                <img src={sample} alt="sample img" className='object-cover max-w-[100px]' />
            </div>
            <div>
                <h3 className='text-[28px] font-sans  text-[#e9edef] text-center'>Welcome to your own space!</h3>
                <p className='text-[#8696a0] text-[1rem] text-center m-auto max-w-[80%]'>Chitchat, Make calls, and get a faster experience.</p>
            </div>
        </div>
    )
}

export default DefaultComp