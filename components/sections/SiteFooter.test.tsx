import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("is a contentinfo landmark with grouped navigation", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    for (const name of ["Bikes", "Support", "Company"]) {
      expect(screen.getByRole("navigation", { name })).toBeInTheDocument();
    }
  });

  it("links to the store finder", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Find a store" })).toHaveAttribute(
      "href",
      "/stores",
    );
  });
});
