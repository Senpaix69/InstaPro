import { ThreeDots } from 'react-loader-spinner';

const Loading = () => {
    return (
        <div className='flex pt-40 w-full justify-center h-screen'>
            <ThreeDots color='#00BFFF' height={50} width={40} />
        </div>
    )
}

export default Loading;