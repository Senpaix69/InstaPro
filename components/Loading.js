import { Puff } from "react-loader-spinner";

const Loading = ({ page }) => {
  return (
    <div
      className={`flex flex-col w-full items-center ${
        page
          ? page === "List"
            ? "mt-72"
            : page === "profile"
            ? "mt-80"
            : "mt-52"
          : "justify-center"
      }`}
    >
      <Puff color="white" height={50} width={40} />
    </div>
  );
};

export default Loading;
