export const SidebarDate = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <p className="text-muted-foreground text-sm text-center my-3">
      {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
    </p>
  );
};
