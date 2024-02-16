import { FC } from "react";

interface Props {
  errorMessage: string | null;
  description?: string;
}

const Fallback: FC<Props> = ({
  errorMessage,
  description = "🚑 띠용 에러 발생",
}) => {
  return (
    <>
      {errorMessage}
      {description}
    </>
  );
};

export default Fallback;
