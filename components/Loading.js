import { Puff } from "react-loader-spinner";

const Loading = ({ page }) => {
  return (
    <div
      className={`flex flex-col w-full items-center ${
        page ? (page === "List" ? "mt-56" : "mt-24") : "justify-center"
      } h-screen`}
    >
      <Puff color="white" height={50} width={40} />
    </div>
  );
};

export default Loading;
