import { Puff } from "react-loader-spinner";

const Loading = ({ page, chat }) => {
  return (
    <div
      className={`${
        chat ? "absolute h-screen justify-center" : "flex-col"
      } flex w-full items-center ${
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
