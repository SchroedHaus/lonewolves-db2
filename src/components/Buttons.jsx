const Button = ({ children, type, loading, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      loading={loading}
      className="h-[59px] w-[300px] bg-[#c0c0c0] dark:text-black self-center cursor-pointer"
    >
      {children}
    </button>
  );
};

export default Button;
