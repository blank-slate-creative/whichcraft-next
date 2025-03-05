export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-fit h-full w-full items-center justify-center px-4 py-8 md:p-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
