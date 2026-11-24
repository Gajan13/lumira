import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("shows the four main nav items", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const label of ["Bikes", "Accessories", "Stores", "Service"]) {
      expect(
        within(nav).getByRole("link", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("links every nav item to a section that exists on the home page", () => {
    const { container } = render(
      <>
        <SiteHeader />
        <Home />
        <SiteFooter />
      </>,
    );
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const link of within(nav).getAllByRole("link")) {
      const href = link.getAttribute("href") ?? "";
      expect(href).toMatch(/^\/#[a-z-]+$/);
      const id = href.slice(2);
      expect(
        container.querySelector(`#${id}`),
        `section #${id}`,
      ).not.toBeNull();
    }
  });

  it("has search and account links with accessible names", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Account" })).toBeInTheDocument();
  });
});
