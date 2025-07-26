export default function Header(props: { font: string }) {
  return (
    <header className="p-4">
      <h1 className={`${props.font} text-bice-blue-400 font-bold text-2xl`}>
        Cooooster
      </h1>
    </header>
  );
}
