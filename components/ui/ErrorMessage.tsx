interface IErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: IErrorMessageProps) {
  return (
    <div className="flex justify-center items-center min-h-[200px] text-destructive">
      <p>{message}</p>
    </div>
  );
}
