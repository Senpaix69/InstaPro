import { ThreeDots } from "react-loader-spinner";

const Loading = ({ page }) => {
  return (
    <div
      className={`flex flex-col w-full items-center ${
        page ? "mt-24" : "justify-center"
      } h-screen`}
    >
      <h1 className="dark: text-gray-300 font-semibold">Loading...</h1>
      <ThreeDots color="#FFFF" height={50} width={40} />
    </div>
  );
};

export default Loading;
