export default function Page({ children, ...props }) {
  return (
    <div className="py-5 px-4" {...props}>
      <div className="mt-5">{children}</div>
    </div>
  );
}
