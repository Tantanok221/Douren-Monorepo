import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/form/product")({
  component: () => <AllProductForm />,
});

function AllProductForm() {
  return (
    <>
      <ProductForm />
    </>
  );
}

function ProductForm() {
  return <></>;
}
