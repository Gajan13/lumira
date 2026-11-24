import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("renders the hero headline as the only h1", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("The easy way across town.");
  });

  it("puts the test ride and the secondary link in the hero", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: "Book a test ride" }),
    ).toHaveAttribute("href", "/test-ride");
    expect(screen.getByRole("link", { name: "See the bike" })).toHaveAttribute(
      "href",
      "/bikes",
    );
  });

  it("links to the store finder", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: /find a store near you/i }),
    ).toHaveAttribute("href", "/stores");
  });

  it("describes the hero bike image (decorative copies stay hidden)", () => {
    render(<Home />);
    expect(
      screen.getByRole("img", { name: /lumira electric city bike/i }),
    ).toBeInTheDocument();
  });

  it("groups the hero highlights in one list", () => {
    render(<Home />);
    const list = screen.getByRole("list", { name: "Highlights" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("has one scene section per feature, each with a heading", () => {
    const { container } = render(<Home />);
    const scenes = Array.from(container.querySelectorAll("[data-scene]")).map(
      (el) => el.getAttribute("data-scene"),
    );
    expect(scenes).toEqual(["hero", "battery", "lights", "colours", "outro"]);
  });

  it("shows four spec figures", () => {
    render(<Home />);
    const specs = screen
      .getByRole("heading", { name: "The numbers." })
      .closest("section") as HTMLElement;
    expect(within(specs).getAllByRole("definition")).toHaveLength(4);
  });
});
