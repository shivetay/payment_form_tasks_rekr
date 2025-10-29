import { CardComponent, FormComponent } from "@/components";
import "./styles/page.css";

export default function Home() {
  return (
    <div className="form-page">
      <main>
        <CardComponent>
          <FormComponent />
        </CardComponent>
      </main>
    </div>
  );
}
