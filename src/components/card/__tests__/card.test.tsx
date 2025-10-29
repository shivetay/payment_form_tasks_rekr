import { render, screen } from "@testing-library/react";
import { CardComponent } from "../card";

describe("CardComponent", () => {
  it("should render children correctly", () => {
    const testContent = "Test card content";

    render(
      <CardComponent>
        <div>{testContent}</div>
      </CardComponent>,
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
});
