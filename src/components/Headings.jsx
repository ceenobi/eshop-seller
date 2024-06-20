export default function Headings({ text, color, size, ...props }) {
  return (
    <h1 className="fw-bold" style={{ color: color, fontSize: size, ...props }}>
      {text}
    </h1>
  );
}
